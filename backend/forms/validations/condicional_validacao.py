from rest_framework.exceptions import ValidationError
import re


class CondicionalValidationStrategy:

    def validate(self, data):
        campos = data.get("campos", [])
        campo_ids = {c["id"] for c in campos}
        errors = {}

        for campo in campos:
            condicional = campo.get("condicional", "")
            if not condicional:
                continue

            if not self._validar_sintaxe(condicional):
                errors.setdefault(campo["id"], []).append(
                    f"Expressão condicional inválida: '{condicional}'"
                )

            campos_referenciados = self._extrair_campos(condicional)
            for ref in campos_referenciados:
                if ref not in campo_ids:
                    errors.setdefault(campo["id"], []).append(
                        f"Condicional faz referência a campo inexistente: '{ref}'"
                    )

        if errors:
            raise ValidationError(errors)

    def _extrair_campos(self, expressao):
        tokens = re.findall(r"[a-zA-Z_][a-zA-Z0-9_]*", expressao)
        return [t for t in tokens if t not in ("true", "false", "and", "or", "not")]

    def _validar_sintaxe(self, expressao):
        padrao = r"^[\w\s=!><&|()]+$"
        return bool(re.match(padrao, expressao.strip()))
