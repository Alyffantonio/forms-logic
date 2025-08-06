from rest_framework import serializers

from .validations.formulario_validacao import FormularioValidationStrategy
from .validations.campo_validacao import CamposValidationStrategy
from .validations.dependencia_validacao import DependenciasValidationStrategy
from .validations.condicional_validacao import CondicionalValidationStrategy

# serializers.py
from rest_framework import serializers
from .models import Formulario, Campo

class SchemaVersionFilter:
    def get_schema_version(self, obj):
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

        schema_mais_recente = obj.formularioschemas_set.filter(is_ativo=True).order_by('-schema_version').first()
        if schema_mais_recente:
            campos_do_schema = schema_mais_recente.campos.all()
            # Usa o CampoDetailSerializer que já foi definido acima
            return CampoDetailSerializer(campos_do_schema, many=True).data
        return []


class FormularioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formulario
        fields = ['nome', 'descricao']

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

class FormularioListSerializer(SchemaVersionFilter, SchemaActiveFilter, serializers.ModelSerializer):
    id = serializers.CharField(source='string_id', read_only=True)
    criado_em = serializers.DateTimeField(source='data_criacao', read_only=True)
    schema_version = serializers.SerializerMethodField()
    is_ativo = serializers.SerializerMethodField()

    class Meta:
        model = Formulario
        fields = ['id', 'nome', 'schema_version', 'is_ativo', 'criado_em']

class FormularioDetailSerializer(SchemaVersionFilter, SchemaActiveFields, serializers.ModelSerializer):
    id = serializers.CharField(source='string_id', read_only=True)
    criado_em = serializers.DateTimeField(source='data_criacao', read_only=True)
    schema_version = serializers.SerializerMethodField()
    # Agora este campo usará a função herdada de SchemaActiveFields
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

class FormularioUpdateSerializer(serializers.Serializer):
    nome = serializers.CharField(max_length=255)
    descricao = serializers.CharField(max_length=500, required=False, allow_blank=True)
    campos = serializers.ListField(child=serializers.DictField(), allow_empty=False)