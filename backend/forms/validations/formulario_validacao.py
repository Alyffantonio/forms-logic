from rest_framework.exceptions import ValidationError

class FormularioValidationStrategy:
    def validate(self, data):
        errors = {}

        nome = data.get("nome")
        if not nome or not nome.strip():
            errors["nome"] = "O campo 'nome' é obrigatório."
        elif len(nome) > 255:
            errors["nome"] = "O campo 'nome' deve ter no máximo 255 caracteres."

        descricao = data.get("descricao", "")
        if descricao and len(descricao) > 50:
            errors["descricao"] = "O campo 'descricao' deve ter no máximo 50 caracteres."

        campos = data.get("campos")
        if not campos or not isinstance(campos, list) or not (1 <= len(campos) <= 100):
            raise ValidationError({
                "erro": "payload_invalido",
                "mensagem": "O campo 'campos' deve conter entre 1 e 100 itens válidos."
            })

        elif not (1 <= len(campos) <= 100):
            errors["campos"] = "O formulário deve conter entre 1 e 100 campos."

        if errors:
            raise ValidationError(errors)