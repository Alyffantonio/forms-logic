from rest_framework.exceptions import ValidationError
import re


class CondicionalValidationStrategy:
    """
    Valida as expressões condicionais dos campos:
      - verifica se os campos referenciados na expressão existem
      - valida a sintaxe básica da expressão (==, !=, and, or, true, false)
    """

    def validate(self, data):
        campos = data.get("campos", [])
        campo_ids = {c["id"] for c in campos}
        errors = {}

        for campo in campos:
            condicional = campo.get("condicional", "")
            if not condicional:
                continue  # sem condicional, sem validação

            # --- 1. Verificar sintaxe básica ---
            if not self._validar_sintaxe(condicional):
                errors.setdefault(campo["id"], []).append(
                    f"Expressão condicional inválida: '{condicional}'"
                )

            # --- 2. Verificar campos referenciados ---
            campos_referenciados = self._extrair_campos(condicional)
            for ref in campos_referenciados:
                if ref not in campo_ids:
                    errors.setdefault(campo["id"], []).append(
                        f"Condicional faz referência a campo inexistente: '{ref}'"
                    )

        if errors:
            raise ValidationError(errors)

    def _extrair_campos(self, expressao):
        """
        Extrai possíveis IDs de campos de uma expressão.
        Exemplo: "sabe_raca == true and idade_pet > 1" → ["sabe_raca", "idade_pet"]
        """
        # regex que pega palavras alfanuméricas com _ (mas ignora 'true', 'false', operadores)
        tokens = re.findall(r"[a-zA-Z_][a-zA-Z0-9_]*", expressao)
        return [t for t in tokens if t not in ("true", "false", "and", "or", "not")]

    def _validar_sintaxe(self, expressao):
        """
        Validação simplificada: apenas verifica se contém comparadores ou operadores esperados.
        (Não é um parser completo, mas evita strings sem sentido)
        """
        padrao = r"^[\w\s=!><&|()]+$"
        return bool(re.match(padrao, expressao.strip()))
