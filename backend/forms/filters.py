
import django_filters
from .models import FormularioSchemas


class FormularioFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(field_name='formulario__nome', lookup_expr='icontains')

    schema_version = django_filters.NumberFilter(field_name='schema_version')

    data_inicio = django_filters.DateFilter(field_name='data_criacao', lookup_expr='gte')
    data_fim = django_filters.DateFilter(field_name='data_criacao', lookup_expr='lte')

    class Meta:
        model = FormularioSchemas
        fields = ['nome', 'schema_version']