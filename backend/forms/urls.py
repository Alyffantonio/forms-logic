# formularios/urls.py

from django.urls import path
from .views import FormularioCreateView

urlpatterns = [
    path('formularios/', FormularioCreateView.as_view(), name='formulario-create'),
]