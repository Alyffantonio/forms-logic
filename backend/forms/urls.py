# formularios/urls.py

from django.urls import path
from .views import FormularioCreateView, FormularioDetailView, FormularioListView, FormularioDeleteView,FormularioUpdateView

urlpatterns = [
    path('formularios/save/', FormularioCreateView.as_view(), name='formulario-create'),
    path('formularios/', FormularioListView.as_view(), name='formulario-list'),
    path('formularios/<int:id>/', FormularioDetailView.as_view(), name='formulario-detail'),
    path('formularios/update/<int:pk>/', FormularioUpdateView.as_view(), name='formulario-update'),
    path('formularios/delete/<int:id>/', FormularioDeleteView.as_view(), name='formulario-delete'),
]
