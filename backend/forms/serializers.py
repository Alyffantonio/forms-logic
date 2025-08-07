from .validations.formulario_validacao import FormularioValidationStrategy
from .validations.campo_validacao import CamposValidationStrategy
from .validations.dependencia_validacao import DependenciasValidationStrategy
from .validations.condicional_validacao import CondicionalValidationStrategy
from rest_framework.exceptions import ValidationError
from rest_framework import serializers

from .models import Formulario, Campo, FormularioSchemas, Resposta

class SchemaVersionFilter:
    def get_schema_version(self, obj):

        specific_version = self.context.get('version')
        if specific_version:
            return specific_version

        schema_mais_recente = obj.formularioschemas_set.order_by('-schema_version').first()
        if schema_mais_recente:
            return schema_mais_recente.schema_version
        return None

class SchemaActiveFilter:
    def get_is_ativo(self, obj):
        ativo = obj.formularioschemas_set.order_by('-schema_version').first()
        if ativo:
            return ativo.is_ativo
        return False

class SchemaActiveFields:
    def get_campos(self, obj):
        specific_version = self.context.get('version')
        if specific_version:
            schema_especifico = obj.formularioschemas_set.filter(schema_version=specific_version).first()
            if schema_especifico:
                campos_do_schema = schema_especifico.campos.all()
                return CampoDetailSerializer(campos_do_schema, many=True).data
            return []

        schema_mais_recente = obj.formularioschemas_set.filter(is_ativo=True).order_by('-schema_version').first()
        if schema_mais_recente:
            campos_do_schema = schema_mais_recente.campos.all()
            return CampoDetailSerializer(campos_do_schema, many=True).data
        return []

class FieldsValidate:

    def validate(self, data):
        strategies = [
            FormularioValidationStrategy(),
            CamposValidationStrategy(),
            DependenciasValidationStrategy(),
            CondicionalValidationStrategy(),
        ]
        for strategy in strategies:
            strategy.validate(self.initial_data)
        return data
#----------------------

class FormularioCreateSerializer(FieldsValidate,serializers.ModelSerializer):
    class Meta:
        model = Formulario
        fields = ['nome', 'descricao']

class FormularioUpdateSerializer(FieldsValidate, serializers.Serializer):
    nome = serializers.CharField(max_length=255)
    descricao = serializers.CharField(max_length=500, required=False, allow_blank=True)
    campos = serializers.ListField(child=serializers.DictField(), allow_empty=False)

class FormularioListSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='formulario.string_id', read_only=True)
    nome = serializers.CharField(source='formulario.nome', read_only=True)

    criado_em = serializers.DateTimeField(source='data_criacao', read_only=True)

    class Meta:
        model = FormularioSchemas
        fields = ['id', 'nome', 'schema_version', 'is_ativo', 'criado_em']

class FormularioDetailSerializer(SchemaVersionFilter, SchemaActiveFields, serializers.ModelSerializer):
    id = serializers.CharField(source='string_id', read_only=True)
    criado_em = serializers.DateTimeField(source='data_criacao', read_only=True)
    schema_version = serializers.SerializerMethodField()
    campos = serializers.SerializerMethodField()

    class Meta:
        model = Formulario
        fields = ['id', 'nome', 'descricao', 'schema_version', 'criado_em', 'campos']

class CampoDetailSerializer(serializers.ModelSerializer):

    id = serializers.CharField(source='campo_id')

    class Meta:
        model = Campo
        fields = [
            'id', 'label', 'tipo', 'obrigatorio', 'multilinha', 'capitalizar',
            'formula', 'condicional', 'dependencias', 'validacoes', 'opcoes'
        ]


class RespostaSerializer(serializers.ModelSerializer):
    respostas = serializers.JSONField()

    class Meta:
        model = Resposta
        fields = ['respostas']

    def validate(self, data):
        formulario = self.context['formulario']
        respostas_enviadas = data.get('respostas', {})

        schema = FormularioSchemas.objects.filter(
            formulario=formulario, is_ativo=True
        ).order_by('-schema_version').first()

        if not schema:
            raise ValidationError("Este formulário não possui uma versão ativa para receber respostas.")

        campos_do_schema = schema.campos.all()
        errors = {}

        for campo in campos_do_schema:
            if campo.obrigatorio and campo.campo_id not in respostas_enviadas:
                errors.setdefault(campo.campo_id, []).append("Campo obrigatório não informado.")


        if errors:
            raise ValidationError({
                "erro": "validacao_falhou",
                "mensagem": "Alguns campos obrigatórios não foram preenchidos.",
                "erros": errors
            })


        data['formulario'] = formulario
        data['schema'] = schema

        data['calculados'] = {}

        return data
