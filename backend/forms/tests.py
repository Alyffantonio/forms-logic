# em backend/forms/tests.py

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Formulario, FormularioSchemas, Campo, Resposta

User = get_user_model()

class FormularioAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        self.client.force_authenticate(user=self.user)

        self.valid_payload = {
            "nome": "Formulário de Teste",
            "descricao": "Uma descrição de teste.",
            "campos": [
                {
                    "id": "nome_completo",
                    "label": "Nome Completo",
                    "tipo": "text",
                    "obrigatorio": True,
                    "validacoes": [{"tipo": "nao_vazio"}]
                },
                {
                    "id": "idade",
                    "label": "Idade",
                    "tipo": "number",
                    "obrigatorio": True,
                    "validacoes": [{"tipo": "minimo", "valor": "18"}]
                }
            ]
        }

    def test_criar_formulario_com_sucesso(self):

        url = '/api/v1/formularios/save/'
        response = self.client.post(url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Formulario.objects.count(), 1)
        self.assertEqual(FormularioSchemas.objects.count(), 1)

        formulario_criado = Formulario.objects.get()
        self.assertEqual(formulario_criado.nome, self.valid_payload['nome'])

        self.assertEqual(Campo.objects.count(), 2)
        self.assertTrue(Campo.objects.filter(campo_id='nome_completo').exists())
        self.assertTrue(Campo.objects.filter(campo_id='idade').exists())

    def test_falha_criar_formulario_com_id_duplicado(self):
        payload_invalido = {
            "nome": "Formulário com Erro",
            "descricao": "Tentando criar com IDs duplicados.",
            "campos": [
                {
                    "id": "campo_repetido",
                    "label": "Campo 1",
                    "tipo": "text"
                },
                {
                    "id": "campo_repetido",
                    "label": "Campo 2",
                    "tipo": "text"
                }
            ]
        }
        url = '/api/v1/formularios/save/'
        response = self.client.post(url, payload_invalido, format='json')

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

        self.assertEqual(Formulario.objects.count(), 0)
        self.assertEqual(FormularioSchemas.objects.count(), 0)

        self.assertEqual(response.data['erro'], 'id_duplicado')

    def test_atualizar_formulario_cria_nova_versao(self):

            url_criacao = '/api/v1/formularios/save/'
            self.client.post(url_criacao, self.valid_payload, format='json')
            formulario_criado = Formulario.objects.get()

            url_atualizacao = f'/api/v1/formularios/update/{formulario_criado.id}/'
            payload_atualizado = self.valid_payload.copy()
            payload_atualizado['nome'] = "Formulário de Teste (Versão 2)"
            payload_atualizado['campos'].append({
                "id": "email",
                "label": "E-mail",
                "tipo": "text"
            })

            response = self.client.put(url_atualizacao, payload_atualizado, format='json')

            self.assertEqual(response.status_code, status.HTTP_200_OK)

            self.assertEqual(FormularioSchemas.objects.count(), 2)
            self.assertTrue(FormularioSchemas.objects.filter(formulario=formulario_criado, schema_version=2).exists())

            self.assertEqual(response.data['schema_version'], 2)
            self.assertEqual(response.data['mensagem'], "Nova versão criada com sucesso")

    def test_deletar_formulario_faz_soft_delete(self):

        url_criacao = '/api/v1/formularios/save/'
        self.client.post(url_criacao, self.valid_payload, format='json')
        formulario_criado = Formulario.objects.get()

        url_delete = f'/api/v1/formularios/delete/{formulario_criado.id}/'
        response = self.client.delete(url_delete)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        formulario_criado.refresh_from_db()

        self.assertIsNotNone(formulario_criado.data_remocao)

        self.assertEqual(Formulario.objects.count(), 1)

    def test_submeter_resposta_com_sucesso(self):
        url_criacao = '/api/v1/formularios/save/'
        self.client.post(url_criacao, self.valid_payload, format='json')
        formulario_criado = Formulario.objects.get()

        url_resposta = f'/api/v1/formularios/{formulario_criado.id}/respostas/'
        payload_resposta = {
            "respostas": {
                "nome_completo": "Alyff Antonio",
                "idade": 30
            }
        }

        response = self.client.post(url_resposta, payload_resposta, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Resposta.objects.count(), 1)

        self.assertEqual(response.data['mensagem'], "Resposta registrada com sucesso.")

    def test_falha_criar_formulario_com_dependencia_circular(self):
        payload_circular = {
            "nome": "Formulário Circular",
            "campos": [
                {
                    "id": "campo_a",
                    "label": "Campo A",
                    "tipo": "calculated",
                    "formula": "campo_b + 1",
                    "dependencias": ["campo_b"]
                },
                {
                    "id": "campo_b",
                    "label": "Campo B",
                    "tipo": "calculated",
                    "formula": "campo_a - 1",
                    "dependencias": ["campo_a"]  # campo_b depende de campo_a
                }
            ]
        }

        url = '/api/v1/formularios/save/'
        response = self.client.post(url, payload_circular, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertIn("Dependência circular detectada", str(response.data))

    def test_falha_submeter_resposta_para_versao_inativa(self):

            self.client.post('/api/v1/formularios/save/', self.valid_payload, format='json')
            formulario_criado = Formulario.objects.get()

            url_atualizacao = f'/api/v1/formularios/update/{formulario_criado.id}/'
            payload_atualizado = self.valid_payload.copy()
            payload_atualizado['nome'] = "Formulário Versão 2"
            self.client.put(url_atualizacao, payload_atualizado, format='json')

            url_resposta = f'/api/v1/formularios/{formulario_criado.id}/respostas/'
            payload_resposta = {
                "respostas": {"campo_inexistente": "valor"}
            }

            payload_resposta_incompleta = {
                "respostas": {"nome_completo": "Teste"}
            }

            response = self.client.post(url_resposta, payload_resposta_incompleta, format='json')

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn("validacao_falhou", response.data['erro'])