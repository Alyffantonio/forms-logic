import django_filters
from .models import Formulario

class FormularioFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(field_name='nome', lookup_expr='icontains')
    schema_version = django_filters.NumberFilter(field_name='formularioschemas__schema_version')
    data_inicio = django_filters.DateFilter(field_name='data_criacao', lookup_expr='gte')
    data_fim = django_filters.DateFilter(field_name='data_criacao', lookup_expr='lte')

    class Meta:
        model = Formulario
        fields = ['nome', 'schema_version']  # campos principais
