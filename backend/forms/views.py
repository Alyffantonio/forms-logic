from django.db import transaction
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import FormularioSchemas, Campo, Formulario
from .serializers import FormularioSerializer, FormularioDetailSerializer, FormularioListSerializer, FormularioUpdateSerializer
from .filters import FormularioFilter
from .pagination import FormularioPagination

class FormularioCreateView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = FormularioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            formulario = serializer.save()

            schema = FormularioSchemas.objects.create(
                formulario=formulario,
                schema_version=1,
                is_ativo=True
            )

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

class FormularioListView(generics.ListAPIView):
    queryset = Formulario.objects.filter(data_remocao__isnull=True)
    serializer_class = FormularioListSerializer
    pagination_class = FormularioPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = FormularioFilter
    ordering_fields = ['nome', 'data_criacao']
    ordering = ['-data_criacao']

    def get_ordering(self):
        ordenar_por = self.request.query_params.get('ordenar_por', None)
        ordem = self.request.query_params.get('ordem', 'asc')

        if ordenar_por in ['nome', 'data_criacao']:
            return [ordenar_por if ordem == 'asc' else f'-{ordenar_por}']

        return super().get_ordering()

class FormularioDetailView(generics.RetrieveAPIView):

    queryset = Formulario.objects.filter(formularioschemas__is_ativo=True).distinct()
    serializer_class = FormularioDetailSerializer

    lookup_field = 'id'

class FormularioUpdateView(generics.UpdateAPIView):
    queryset = Formulario.objects.all()
    serializer_class = FormularioUpdateSerializer
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        formulario = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            ultima_versao = FormularioSchemas.objects.filter(formulario=formulario).order_by('-schema_version').first()
            nova_versao = (ultima_versao.schema_version + 1) if ultima_versao else 1

            schema = FormularioSchemas.objects.create(
                formulario=formulario,
                schema_version=nova_versao,
                is_ativo=True
            )

            campos = serializer.validated_data["campos"]
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

        return Response(
            {
                "id": formulario.id,
                "schema_version": schema.schema_version,
                "mensagem": "Nova versão criada com sucesso",
                "criado_em": schema.data_criacao.isoformat(),
            },
            status=status.HTTP_200_OK,
        )

class FormularioDeleteView(generics.DestroyAPIView):
    queryset = Formulario.objects.all()

    def delete(self, request, *args, **kwargs):
        formulario = self.get_object()
        formulario.data_remocao = timezone.now()
        formulario.usuario_remocao = request.user.username if request.user.is_authenticated else "sistema"
        formulario.save(update_fields=["data_remocao", "usuario_remocao"])
        return Response(status=status.HTTP_204_NO_CONTENT)