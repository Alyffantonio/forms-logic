from rest_framework import serializers
from .models import Formulario, Campo


# ==============================================================================
# ESTRATÉGIAS DE VALIDAÇÃO (SEU CÓDIGO COM AJUSTES)
# ==============================================================================
class ValidadorStrategy:
    """Classe base para a estratégia de validação."""

    def validate(self, campo_data):
        pass


class ValidarSelect(ValidadorStrategy):
    def validate(self, campo_data):
        # 1. Pega o ID da chave correta: 'campo_id'
        campo_id = campo_data.get('campo_id')

        # 2. As definições já foram agrupadas pelo CampoSerializer
        definicoes = campo_data.get('definicoes', {})
        opcoes = definicoes.get('opcoes')

        # 3. Sua validação agora funciona corretamente
        if not isinstance(opcoes, list) or not opcoes:
            raise serializers.ValidationError(
                f"O campo 'select' '{campo_id}' deve ter uma lista de 'opcoes' não vazia.")

        valores = set()
        for opcao in opcoes:
            if not isinstance(opcao, dict) or 'label' not in opcao or 'value' not in opcao:
                raise serializers.ValidationError(
                    f"Cada item em 'opcoes' do campo '{campo_id}' deve ser um objeto com 'label' e 'value'.")
            if opcao['value'] in valores:
                raise serializers.ValidationError(
                    f"O 'value' '{opcao['value']}' está duplicado nas opções do campo '{campo_id}'.")
            valores.add(opcao['value'])


class ValidarCalculated(ValidadorStrategy):
    """Valida campos do tipo 'calculated'."""

    def validate(self, campo_data):
        campo_id = campo_data.get('id')
        # Corrigido: Procura 'formula' e 'dependencias' dentro de 'definicoes'
        definicoes = campo_data.get('definicoes', {})

        if 'formula' not in definicoes or not definicoes.get('formula'):
            raise serializers.ValidationError(f"O campo 'calculated' '{campo_id}' deve ter uma 'formula'.")
        if 'dependencias' not in definicoes or not isinstance(definicoes.get('dependencias'), list):
            raise serializers.ValidationError(
                f"O campo 'calculated' '{campo_id}' deve ter uma lista de 'dependencias'.")


class ValidarNumber(ValidadorStrategy):
    """Valida campos do tipo 'number'."""

    def validate(self, campo_data):
        campo_id = campo_data.get('id')
        # Corrigido: Procura 'validacoes' dentro de 'definicoes'
        definicoes = campo_data.get('definicoes', {})
        validacoes = definicoes.get('validacoes', [])

        minimo_val = next((v.get('valor') for v in validacoes if v.get('tipo') == 'minimo'), None)
        maximo_val = next((v.get('valor') for v in validacoes if v.get('tipo') == 'maximo'), None)

        if minimo_val is not None and maximo_val is not None:
            if float(minimo_val) > float(maximo_val):
                raise serializers.ValidationError(
                    f"No campo '{campo_id}', o valor 'minimo' não pode ser maior que o 'maximo'.")


# ==============================================================================
# SERIALIZERS ANINHADOS
# ==============================================================================
class DefinicoesSerializer(serializers.Serializer):
    """
    Este serializer é um 'apanhado geral' para todas as chaves extras.
    Ele garante que o DRF saiba como lidar com o dicionário de definições.
    """

    def to_internal_value(self, data):
        return data


class CampoSerializer(serializers.ModelSerializer):
    """Define a estrutura de entrada e saída para um único campo."""
    id = serializers.CharField(source='campo_id')

    # O source='*' agrupa todas as chaves do JSON de entrada que não são
    # campos explícitos do CampoSerializer ('id', 'label', 'tipo', 'obrigatorio')
    # dentro da chave 'definicoes'.
    definicoes = DefinicoesSerializer(source='*', required=False)

    class Meta:
        model = Campo
        fields = ['id', 'label', 'tipo', 'obrigatorio', 'definicoes']


# ==============================================================================
# SERIALIZER PRINCIPAL
# ==============================================================================
class FormularioSerializer(serializers.ModelSerializer):
    """
    Serializer principal que orquestra a validação e criação do formulário.
    """
    id = serializers.CharField(source='string_id', read_only=True)
    campos = CampoSerializer(many=True)

    VALIDATOR_STRATEGIES = {
        'select': ValidarSelect(),
        'calculated': ValidarCalculated(),
        'number': ValidarNumber(),
    }

    class Meta:
        model = Formulario
        fields = ['id', 'nome', 'descricao', 'campos']

    def validate_campos(self, campos_data):
        """Valida a lista de campos como um todo."""
        if not campos_data:
            raise serializers.ValidationError("O campo 'campos' não pode ser vazio.")
        if len(campos_data) > 100:
            raise serializers.ValidationError("O formulário não pode ter mais de 100 campos.")

        ids_dos_campos = set()
        for campo in campos_data:
            # O CampoSerializer já converteu 'id' para 'campo_id'
            campo_id = campo.get('campo_id')
            if not campo_id:
                raise serializers.ValidationError("Cada campo deve ter um 'id'.")
            if not str(campo_id).replace('_', '').isalnum():
                raise serializers.ValidationError(f"O id do campo '{campo_id}' deve ser alfanumérico.")
            if campo_id in ids_dos_campos:
                raise serializers.ValidationError(f"ID de campo duplicado: {campo_id}")
            ids_dos_campos.add(campo_id)

            # Executa a estratégia de validação para o tipo de campo
            strategy = self.VALIDATOR_STRATEGIES.get(campo.get('tipo'))
            if strategy:
                strategy.validate(campo)

        return campos_data

    def create(self, validated_data):
        """
        Ensina o serializer a criar um Formulario e seus Campos aninhados.
        """
        campos_data = validated_data.pop('campos')
        formulario = Formulario.objects.create(**validated_data)

        for campo_data in campos_data:
            Campo.objects.create(formulario=formulario, **campo_data)

        return formulario