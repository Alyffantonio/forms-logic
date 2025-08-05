from django.db import transaction
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import FormularioSchemas, Campo
from .serializers import FormularioSerializer


class FormularioCreateView(APIView):

    def post(self, request, *args, **kwargs):
        # 1. Valida e cria o Formulario usando o serializer
        serializer = FormularioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            # 2. Salva o Formulario (o serializer faz isso)
            formulario = serializer.save()

            # 3. Cria a primeira versão do schema
            schema = FormularioSchemas.objects.create(
                formulario=formulario,
                schema_version=1,
                is_ativo=True
            )

            # 4. Cria os campos vinculados a essa versão
            campos = request.data.get("campos", [])
            for campo in campos:
                Campo.objects.create(
                    schema=schema,
                    campo_id=campo["id"],
                    label=campo["label"],
                    tipo=campo["tipo"],
                    obrigatorio=campo.get("obrigatorio", False),
                    capitalizar=campo.get("capitalizar", False),
                    multilinha=campo.get("multilinha", False),
                    formula=campo.get("formula", ""),
                    condicional=campo.get("condicional", ""),
                    dependencias=campo.get("dependencias", []),
                    validacoes=campo.get("validacoes", []),
                    opcoes=campo.get("opcoes", []),
                )

        resposta_sucesso = {
            "id": str(formulario.id),
            "schema_version": schema.schema_version,
            "mensagem": "Formulário criado com sucesso",
            "criado_em": formulario.data_criacao.isoformat(),
        }
        return Response(resposta_sucesso, status=status.HTTP_201_CREATED)
