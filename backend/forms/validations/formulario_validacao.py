from rest_framework.exceptions import ValidationError

class FormularioValidationStrategy:
    """Valida os dados básicos do formulário (nome, descrição e campos)."""
    def validate(self, data):
        errors = {}

        # Validar nome
        nome = data.get("nome")
        if not nome or not nome.strip():
            errors["nome"] = "O campo 'nome' é obrigatório."
        elif len(nome) > 255:
            errors["nome"] = "O campo 'nome' deve ter no máximo 255 caracteres."

        # Validar descrição
        descricao = data.get("descricao", "")
        if descricao and len(descricao) > 500:
            errors["descricao"] = "O campo 'descricao' deve ter no máximo 500 caracteres."

        # Validar campos (estrutura base)
        campos = data.get("campos")
        if not campos or not isinstance(campos, list) or len(campos) == 0:
            errors["campos"] = "O formulário deve conter ao menos 1 campo válido."

        if errors:
            raise ValidationError(errors)
