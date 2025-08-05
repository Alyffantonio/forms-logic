from rest_framework import serializers

from .validations.formulario_validacao import FormularioValidationStrategy
from .validations.campo_validacao import CamposValidationStrategy
from .validations.dependencia_validacao import DependenciasValidationStrategy
from .validations.condicional_validacao import CondicionalValidationStrategy

# serializers.py
from rest_framework import serializers
from .models import Formulario

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
