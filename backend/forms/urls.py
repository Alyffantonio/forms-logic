from django.urls import path
from .views import FormularioCreateView, FormularioDetailView, FormularioListView, FormularioDeleteView,FormularioUpdateView, RespostaCreateView

urlpatterns = [
    path('formularios/save/', FormularioCreateView.as_view(), name='formulario-create'),
    path('formularios/', FormularioListView.as_view(), name='formulario-list'),
    path('formularios/<int:id>/versao/<int:version>/', FormularioDetailView.as_view(), name='formulario-detail'),
    path('formularios/update/<int:id>/', FormularioUpdateView.as_view(), name='formulario-update'),
    path('formularios/delete/<int:id>/', FormularioDeleteView.as_view(), name='formulario-delete'),
    path('formularios/<int:id>/respostas/', RespostaCreateView.as_view(), name='resposta-create'),
]
