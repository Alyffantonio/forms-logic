from django.db import models


# ==============================================================================
# 1. Modelo para o Formulário (A estrutura principal)
# ==============================================================================
class Formulario(models.Model):
    # O Django criará automaticamente um campo 'id' numérico e sequencial (1, 2, 3...).
    # Este 'id' será a nossa chave primária no banco de dados.

    # --- CAMPOS DO BANCO DE DADOS ---
    nome = models.CharField(max_length=255)
    descricao = models.TextField(max_length=500, blank=True, null=True)
    schema_version = models.IntegerField(default=1)
    is_ativo = models.BooleanField(default=True)
    protegido = models.BooleanField(default=False)

    # Timestamps e controle de soft-delete
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_remocao = models.DateTimeField(null=True, blank=True)
    usuario_remocao = models.CharField(max_length=150, null=True, blank=True)

    # --- PROPRIEDADE VIRTUAL (NÃO VAI PARA O BANCO) ---
    @property
    def string_id(self):
        """
        Esta propriedade formata o ID numérico do banco (ex: 1)
        em uma string com zeros à esquerda (ex: "formulario_001") para ser usada na API.
        """
        return f"formulario_{self.id:03}"

    def __str__(self):
        return f"{self.nome} (v{self.schema_version})"

    class Meta:
        ordering = ['-data_criacao']


# ==============================================================================
# 2. Modelo para os Campos (Os "tijolos" de cada formulário)
# ==============================================================================
class Campo(models.Model):
    TIPO_DE_CAMPO_CHOICES = [
        ('text', 'Texto'),
        ('number', 'Número'),
        ('date', 'Data'),
        ('select', 'Seleção'),
        ('boolean', 'Booleano'),
        ('calculated', 'Calculado'),
    ]

    formulario = models.ForeignKey(Formulario, on_delete=models.CASCADE, related_name='campos')

    campo_id = models.CharField(max_length=100)
    label = models.CharField(max_length=255)
    tipo = models.CharField(max_length=20, choices=TIPO_DE_CAMPO_CHOICES)
    obrigatorio = models.BooleanField(default=False)

    # Campo JSON flexível para guardar todas as configurações e regras
    # ex: { "opcoes": [...], "validacoes": [...], "formula": "...", "dependencias": [...] }
    definicoes = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.label} ({self.tipo}) no formulário {self.formulario.nome}"

    class Meta:
        # Garante que o 'campo_id' seja único dentro de um mesmo formulário
        unique_together = ('formulario', 'campo_id')


# ==============================================================================
# 3. Modelo para as Respostas (Os dados preenchidos pelos usuários)
# ==============================================================================
class Resposta(models.Model):
    # Para o ID da resposta, um UUID ainda é uma ótima escolha, como no README

    formulario = models.ForeignKey(Formulario, on_delete=models.PROTECT, related_name='respostas')

    # Guarda as respostas do usuário no formato {"campo_id": "valor_preenchido", ...}
    respostas = models.JSONField()
    calculados = models.JSONField(null=True, blank=True)

    schema_version = models.IntegerField()

    criado_em = models.DateTimeField(auto_now_add=True)
    is_ativo = models.BooleanField(default=True)
    data_remocao = models.DateTimeField(null=True, blank=True)
    usuario_remocao = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return f"Resposta {self.id} para o formulário {self.formulario.nome}"

    class Meta:
        ordering = ['-criado_em']