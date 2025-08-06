from rest_framework.pagination import PageNumberPagination

class FormularioPagination(PageNumberPagination):
    page_query_param = 'pagina'
    page_size_query_param = 'tamanho_pagina'
    max_page_size = 100
    page_size = 20
