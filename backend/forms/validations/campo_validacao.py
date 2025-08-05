from rest_framework.exceptions import ValidationError
import re
from datetime import datetime

class ValidationStrategy:
    """Interface base para estratégias de validação."""
    def validate(self, data):
        raise NotImplementedError("Método validate precisa ser implementado")

class TextFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        errors = []
        # Validar propriedades básicas
        if not campo.get("label"):
            errors.append("Campo texto deve ter 'label'.")
        # Validar regras opcionais
        for regra in campo.get("validacoes", []):
            if regra["tipo"] == "tamanho_minimo" and int(regra.get("valor", 0)) < 0:
                errors.append("Validação tamanho_minimo inválida (não pode ser negativa).")
            if regra["tipo"] == "regex":
                import re
                try:
                    re.compile(regra.get("valor", ""))
                except re.error:
                    errors.append(f"Regex inválida para o campo {campo['id']}.")
        return errors

class NumberFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        errors = []
        for regra in campo.get("validacoes", []):
            tipo = regra["tipo"]
            if tipo in ("minimo", "maximo"):
                try:
                    float(regra.get("valor", 0))
                except ValueError:
                    errors.append(f"Valor inválido para {tipo} em {campo['id']}.")
            if tipo == "multiplo_de" and float(regra.get("valor", 0)) == 0:
                errors.append(f"multiplo_de não pode ser zero em {campo['id']}.")
        return errors

class DateFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        errors = []
        for regra in campo.get("validacoes", []):
            if regra["tipo"] in ("minima", "maxima"):
                # Aqui você pode validar formato ISO YYYY-MM-DD
                from datetime import datetime
                try:
                    datetime.strptime(regra.get("valor", ""), "%Y-%m-%d")
                except ValueError:
                    errors.append(f"Data inválida ({regra['valor']}) para {campo['id']}.")
        return errors

class SelectFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        errors = []
        opcoes = campo.get("opcoes", [])
        if not opcoes:
            errors.append(f"O campo select {campo['id']} deve ter ao menos uma opção.")
        else:
            valores = [o.get("value") for o in opcoes]
            if len(valores) != len(set(valores)):
                errors.append(f"O campo select {campo['id']} tem opções duplicadas.")
        return errors

class BooleanFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        # Booleano não tem regras complexas além do tipo
        return []

class CalculatedFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        errors = []
        if not campo.get("formula"):
            errors.append(f"O campo calculado {campo['id']} deve ter uma fórmula.")
        if not campo.get("dependencias"):
            errors.append(f"O campo calculado {campo['id']} deve ter dependências.")
        return errors

class CamposValidationStrategy(ValidationStrategy):
    def __init__(self):
        self.strategies = {
            "text": TextFieldValidationStrategy(),
            "number": NumberFieldValidationStrategy(),
            "date": DateFieldValidationStrategy(),
            "select": SelectFieldValidationStrategy(),
            "boolean": BooleanFieldValidationStrategy(),
            "calculated": CalculatedFieldValidationStrategy(),
        }

    def validate(self, data):
        campos = data.get("campos", [])
        ids = [c["id"] for c in campos]
        errors = {}

        # Validação de IDs duplicados
        if len(ids) != len(set(ids)):
            raise ValidationError({"campos": "Existem IDs de campos duplicados."})

        for campo in campos:
            tipo = campo.get("tipo")
            if tipo not in self.strategies:
                errors[campo["id"]] = [f"Tipo inválido: {tipo}."]
                continue

            # Executa a strategy específica
            campo_errors = self.strategies[tipo].validate(campo)
            if campo_errors:
                errors[campo["id"]] = campo_errors

        if errors:
            raise ValidationError(errors)
