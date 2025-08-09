from django.db import transaction
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import FormularioSchemas, Campo, Formulario
from .serializers import FormularioCreateSerializer, FormularioDetailSerializer, FormularioListSerializer, FormularioUpdateSerializer, RespostaSerializer
from .filters import FormularioFilter
from .pagination import FormularioPagination
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache


class FormularioCreateView(APIView):

    def post(self, request, *args, **kwargs):
        print("👤 Usuário autenticado:", request.user)
        serializer = FormularioCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            formulario = serializer.save()

            schema = FormularioSchemas.objects.create(
                formulario=formulario,
                schema_version=1,
                is_ativo=True,
                criador=self.request.user
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
        limpar_cache_lista()
        return Response(resposta_sucesso, status=status.HTTP_201_CREATED)


@method_decorator(cache_page(60 * 15), name='dispatch')
class FormularioListView(generics.ListAPIView):
    queryset = FormularioSchemas.objects.filter(formulario__data_remocao__isnull=True).select_related('formulario')

    serializer_class = FormularioListSerializer
    pagination_class = FormularioPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = FormularioFilter
    permission_classes = [AllowAny]

    ordering_fields = ['formulario__nome', 'data_criacao']
    ordering = ['-formulario__nome', '-schema_version']

@method_decorator(cache_page(60 * 15), name='dispatch')
class FormularioDetailView(generics.RetrieveAPIView):
    queryset = Formulario.objects.filter(data_remocao__isnull=True).distinct()
    serializer_class = FormularioDetailSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]


    def get_serializer_context(self):

        context = super().get_serializer_context()
        if 'version' in self.kwargs:
            context['version'] = self.kwargs['version']
        return context

class FormularioUpdateView(generics.UpdateAPIView):
    queryset = Formulario.objects.all()
    serializer_class = FormularioUpdateSerializer
    lookup_field = "id"

    def update(self, request, *args, **kwargs):
        formulario = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():

            FormularioSchemas.objects.filter(formulario=formulario).update(is_ativo=False)

            ultima_versao = FormularioSchemas.objects.filter(formulario=formulario).order_by('-schema_version').first()
            nova_versao = (ultima_versao.schema_version + 1) if ultima_versao else 1

            schema = FormularioSchemas.objects.create(
                formulario=formulario,
                schema_version=nova_versao,
                is_ativo=True,
                criador=self.request.user
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
        limpar_cache_lista()
        cache.delete(f"/api/v1/formularios/{formulario.id}/")
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
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        formulario = self.get_object()

        if formulario.data_remocao:
            return Response({
                "mensagem": f"Formulário '{formulario.string_id}' já estava removido. Nenhuma ação foi realizada.",
                "status": "soft_deleted"
            }, status=status.HTTP_200_OK)

        if FormularioSchemas.objects.filter(formulario=formulario, protegido=True).exists():
            return Response({
                "erro": "formulario_protegido",
                "mensagem": "Este formulário é protegido e não pode ser removido manualmente."
            }, status=status.HTTP_409_CONFLICT)

        try:
            with transaction.atomic():
                FormularioSchemas.objects.filter(formulario=formulario).update(is_ativo=False)

                formulario.data_remocao = timezone.now()
                formulario.usuario_remocao = request.user.username if request.user.is_authenticated else "sistema"
                formulario.save(update_fields=["data_remocao", "usuario_remocao"])

        except Exception as e:
            return Response({
                "erro": "falha_remocao_logica",
                "mensagem": f"Erro interno ao marcar o formulário como removido: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        limpar_cache_lista()
        cache.delete(f"/api/v1/formularios/{formulario.id}/")
        return Response({
            "mensagem": f"Formulário '{formulario.string_id}' marcado como removido com sucesso. Nenhuma resposta foi excluída.",
            "status": "soft_deleted"
        }, status=status.HTTP_200_OK)

class RespostaCreateView(generics.CreateAPIView):
    serializer_class = RespostaSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        formulario_id = self.kwargs.get('id')
        context['formulario'] = generics.get_object_or_404(Formulario, id=formulario_id)
        return context

    def perform_create(self, serializer):
        resposta = serializer.save()

        self.created_instance = resposta

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)

        return Response({
            "mensagem": "Resposta registrada com sucesso.",
            "id_resposta": self.created_instance.id,
            "calculados": self.created_instance.calculados,
            "executado_em": self.created_instance.criado_em.isoformat(),
        }, status=status.HTTP_201_CREATED)


def limpar_cache_lista():
    cache.delete_pattern("/api/v1/formularios/*")
