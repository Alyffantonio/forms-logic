from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import FormularioSerializer


class FormularioCreateView(APIView):

    def post(self, request, *args , **kwargs):

        serializer = FormularioSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        formulario = serializer.save()

        resposta_sucesso = {
            "id": str(formulario.id),
            "schema_version":formulario.schema_version,
            "mensagem":"Formulário criado com sucesso",
            "criado_em":formulario.data_criacao.isoformat(),
        }

        return Response(resposta_sucesso, status=status.HTTP_201_CREATED)