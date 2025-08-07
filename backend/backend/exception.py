# Em backend/backend/exception.py

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, Http404):
        return Response(
            {
                "erro": "formulario_nao_encontrado",
                "mensagem": "O formulário solicitado não foi localizado ou está inativo."
            },
            status=status.HTTP_404_NOT_FOUND
        )
    if response is not None and response.status_code == status.HTTP_400_BAD_REQUEST:
        error_payload = response.data

        if isinstance(error_payload, dict):
            error_type_list = error_payload.get("erro", [])

            if isinstance(error_type_list, list) and error_type_list:
                error_type = error_type_list[0]

                flat_data = {key: value[0] for key, value in error_payload.items() if isinstance(value, list) and value}
                response.data = flat_data

                if error_type == "id_duplicado":
                    response.status_code = status.HTTP_409_CONFLICT

                elif error_type == "regra_invalida":
                    response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY

                elif error_type == "payload_invalido":
                    pass
    return response