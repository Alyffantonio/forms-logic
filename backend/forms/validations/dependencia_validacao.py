from rest_framework.exceptions import ValidationError


class DependenciasValidationStrategy:
    """
    Valida dependências entre campos:
      - verifica se todos os campos dependidos existem
      - detecta ciclos de dependência
    """

    def validate(self, data):
        campos = data.get("campos", [])
        campo_ids = {c["id"] for c in campos}
        errors = {}

        # --- 1. Verificar se dependências existem ---
        for campo in campos:
            dependencias = campo.get("dependencias", [])
            for dep in dependencias:
                if dep not in campo_ids:
                    errors.setdefault(campo["id"], []).append(f"Dependência inválida: {dep}")

        # --- 2. Detectar ciclos ---
        grafo = {c["id"]: c.get("dependencias", []) for c in campos}
        visitados = set()
        pilha = set()

        def dfs(campo_id):
            if campo_id in pilha:  # ciclo detectado
                return True
            if campo_id in visitados:
                return False

            visitados.add(campo_id)
            pilha.add(campo_id)

            for dep in grafo.get(campo_id, []):
                if dfs(dep):
                    return True

            pilha.remove(campo_id)
            return False

        for campo_id in grafo:
            if dfs(campo_id):
                errors.setdefault(campo_id, []).append("Dependência circular detectada")
                break  # um ciclo já é suficiente para invalidar

        if errors:
            raise ValidationError(errors)
