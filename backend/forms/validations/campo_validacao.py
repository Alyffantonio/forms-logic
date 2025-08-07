from rest_framework.exceptions import ValidationError
import re
from datetime import datetime


class ValidationStrategy:
    def validate(self, data):
        raise NotImplementedError("Método validate precisa ser implementado")


class TextFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        errors = []
        campo_id = campo.get('id', 'desconhecido')

        if not campo.get("label"):
            errors.append(f"O campo de texto '{campo_id}' deve ter um 'label'.")

        min_val = None
        max_val = None

        for regra in campo.get("validacoes", []):
            tipo = regra.get("tipo")
            valor = regra.get("valor")

            if tipo == "tamanho_minimo":
                try:
                    min_val = int(valor)
                    if min_val < 0:
                        errors.append(f"Em '{campo_id}', o 'tamanho_minimo' não pode ser negativo.")
                except (ValueError, TypeError):
                    errors.append(f"Em '{campo_id}', o valor de 'tamanho_minimo' deve ser um número inteiro.")

            elif tipo == "tamanho_maximo":
                try:
                    max_val = int(valor)
                    if max_val < 0:
                        errors.append(f"Em '{campo_id}', o 'tamanho_maximo' não pode ser negativo.")
                except (ValueError, TypeError):
                    errors.append(f"Em '{campo_id}', o valor de 'tamanho_maximo' deve ser um número inteiro.")

            elif tipo == "regex":
                if not isinstance(valor, str) or not valor:
                    errors.append(
                        f"Em '{campo_id}', a validação 'regex' deve ter um 'valor' em formato de texto (string).")
                else:
                    try:
                        re.compile(valor)
                    except re.error:
                        errors.append(f"A expressão regular (regex) fornecida para o campo '{campo_id}' é inválida.")

            elif tipo == "nao_conter":
                if not isinstance(valor, list):
                    errors.append(f"Em '{campo_id}', o valor de 'nao_conter' deve ser uma lista de palavras.")

        if min_val is not None and max_val is not None and min_val > max_val:
            errors.append(
                f"No campo '{campo_id}', o 'tamanho_minimo' ({min_val}) não pode ser maior que o 'tamanho_maximo' ({max_val}).")

        return errors


class NumberFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        errors = []
        campo_id = campo.get('id', 'desconhecido')
        validacoes = campo.get("validacoes", [])

        min_val = None
        max_val = None

        for regra in validacoes:
            tipo = regra.get("tipo")
            valor = regra.get("valor")

            if tipo == "minimo":
                try:
                    min_val = float(valor)
                except (ValueError, TypeError):
                    errors.append(f"Valor inválido para 'minimo' no campo {campo_id}.")

            if tipo == "maximo":
                try:
                    max_val = float(valor)
                except (ValueError, TypeError):
                    errors.append(f"Valor inválido para 'maximo' no campo {campo_id}.")

            if tipo == "multiplo_de":
                try:
                    if float(valor) == 0:
                        errors.append(f"'multiplo_de' não pode ser zero no campo {campo_id}.")
                except (ValueError, TypeError):
                    errors.append(f"Valor inválido para 'multiplo_de' no campo {campo_id}.")

        if min_val is not None and max_val is not None and min_val > max_val:
            raise ValidationError({
                "erro": "regra_invalida",
                "campo": campo_id,
                "mensagem": f"Valor máximo ({max_val}) não pode ser menor que o valor mínimo ({min_val})"
            })

        return errors


class DateFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        errors = []
        campo_id = campo.get('id', 'desconhecido')

        minima_str = campo.get("minima")
        maxima_str = campo.get("maxima")

        if minima_str and not iso_date(minima_str):
            errors.append(f"No campo '{campo_id}', a data 'minima' ('{minima_str}') deve estar no formato YYYY-MM-DD.")

        if maxima_str and not iso_date(maxima_str):
            errors.append(f"No campo '{campo_id}', a data 'maxima' ('{maxima_str}') deve estar no formato YYYY-MM-DD.")

        if iso_date(minima_str) and iso_date(maxima_str):
            if minima_str > maxima_str:
                errors.append(
                    f"No campo '{campo_id}', a data 'minima' ({minima_str}) não pode ser posterior à 'maxima' ({maxima_str}).")

        for regra in campo.get("validacoes", []):
            tipo = regra.get("tipo")

            if tipo == "data_futura":
                permitido = regra.get("permitido")
                if not isinstance(permitido, bool):
                    errors.append(
                        f"Em '{campo_id}', a regra 'data_futura' deve ter um valor booleano (true/false) para 'permitido'.")

            elif tipo == "anterior_a":
                campo_comparado = regra.get("campo")
                if not campo_comparado or not isinstance(campo_comparado, str):
                    errors.append(
                        f"Em '{campo_id}', a regra 'anterior_a' deve especificar um 'campo' de referência em formato de texto.")

        return errors


class SelectFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        errors = []
        campo_id = campo.get('id', 'desconhecido')
        opcoes = campo.get("opcoes", [])
        is_multipla = campo.get("multipla", False)

        if not opcoes or not isinstance(opcoes, list):
            raise ValidationError({
                "erro": "payload_invalido",
                "mensagem": f"O campo select '{campo_id}' deve ter uma lista de 'opcoes' com pelo menos uma opção."
            })

        valores = [str(o.get("value")) for o in opcoes if "value" in o]
        if len(valores) != len(set(valores)):
            vistos = set()
            duplicado = next((v for v in valores if v in vistos or vistos.add(v)), None)

            raise ValidationError({
                "erro": "id_duplicado",
                "campo": campo_id,
                "mensagem": f"O valor '{duplicado}' está duplicado nas opções do campo."
            })

        for opcao in opcoes:
            if not isinstance(opcao, dict) or "label" not in opcao or "value" not in opcao:
                errors.append(f"Cada item em 'opcoes' do campo '{campo_id}' deve ser um objeto com 'label' e 'value'.")
                break

        if errors:
            return errors

        min_selecoes = None
        max_selecoes = None

        for regra in campo.get("validacoes", []):
            tipo = regra.get("tipo")
            valor = regra.get("valor")

            if tipo in ("quantidade_minima", "quantidade_maxima") and not is_multipla:
                raise ValidationError({
                    "erro": "regra_invalida",
                    "campo": campo_id,
                    "mensagem": f"A regra '{tipo}' só pode ser usada se 'multipla' for true."
                })

            if tipo == "quantidade_minima":
                try:
                    min_selecoes = int(valor)
                except (ValueError, TypeError):
                    raise ValidationError({"erro": "regra_invalida", "campo": campo_id,
                                           "mensagem": "O valor de 'quantidade_minima' deve ser um número inteiro."})

            elif tipo == "quantidade_maxima":
                try:
                    max_selecoes = int(valor)
                except (ValueError, TypeError):
                    raise ValidationError({"erro": "regra_invalida", "campo": campo_id,
                                           "mensagem": "O valor de 'quantidade_maxima' deve ser um número inteiro."})

        if min_selecoes is not None and max_selecoes is not None and min_selecoes > max_selecoes:
            raise ValidationError({
                "erro": "regra_invalida",
                "campo": campo_id,
                "mensagem": f"A 'quantidade_minima' ({min_selecoes}) não pode ser maior que a 'quantidade_maxima' ({max_selecoes})."
            })

        return []

class BooleanFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        errors = []
        campo_id = campo.get('id', 'desconhecido')

        if not campo.get("label"):
            errors.append(f"O campo booleano '{campo_id}' deve ter um 'label'.")

        for regra in campo.get("validacoes", []):
            tipo = regra.get("tipo")

            if tipo == "valor_esperado":
                valor = regra.get("valor")
                if not isinstance(valor, bool):
                    errors.append(
                        f"Em '{campo_id}', a regra 'valor_esperado' deve ter um 'valor' booleano (true/false).")

        return errors


class CalculatedFieldValidationStrategy(ValidationStrategy):
    def validate(self, campo):
        errors = []
        campo_id = campo.get('id', 'desconhecido')

        formula = campo.get("formula")
        if not formula or not isinstance(formula, str):
            errors.append(f"O campo calculado '{campo_id}' deve ter uma 'formula' em formato de texto (string).")

        dependencias = campo.get("dependencias")
        if not dependencias or not isinstance(dependencias, list):
            errors.append(
                f"O campo calculado '{campo_id}' deve ter uma lista de 'dependencias' com pelo menos um item.")

        if campo.get("validacoes"):
            errors.append(f"O campo calculado '{campo_id}' não deve conter um array de 'validacoes' diretas.")

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
        errors = {}

        if not (1 <= len(campos) <= 100):
            raise ValidationError({"campos": "O formulário deve conter entre 1 e 100 campos."})

        ids = []
        for campo in campos:
            campo_id = campo.get("id")
            if not campo_id:
                raise ValidationError({"campos": "Todos os campos devem ter um 'id'."})
            ids.append(campo_id)
            if not re.match(r"^[a-zA-Z0-9_]+$", campo_id):
                errors.setdefault(campo_id, []).append("O id do campo deve ser alfanumérico e pode conter apenas underscores (_).")

        ids_vistos = set()
        ids_duplicados = set()
        for campo_id in ids:
            if campo_id in ids_vistos:
                ids_duplicados.add(campo_id)
            ids_vistos.add(campo_id)

        if ids_duplicados:
            primeiro_duplicado = list(ids_duplicados)[0]
            raise ValidationError({
                "erro": "id_duplicado",
                "campo": primeiro_duplicado,
                "mensagem": f"Já existe um campo com o id '{primeiro_duplicado}'"
            })

        for campo in campos:
            tipo = campo.get("tipo")
            if tipo not in self.strategies:
                errors.setdefault(campo["id"], []).append(f"Tipo inválido: {tipo}.")
                continue

            campo_errors = self.strategies[tipo].validate(campo)
            if campo_errors:
                errors.setdefault(campo["id"], []).extend(campo_errors)

        if errors:
            raise ValidationError(errors)


def iso_date(date_string):
    try:
        datetime.strptime(date_string, "%Y-%m-%d")
        return True
    except (ValueError, TypeError):
        return False
