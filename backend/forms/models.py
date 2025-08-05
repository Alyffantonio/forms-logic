from django.db import models
import uuid


class Formulario(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField(max_length=500, blank=True, null=True)


    # Controle de auditoria e remoção lógica
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_remocao = models.DateTimeField(null=True, blank=True)
    usuario_remocao = models.CharField(max_length=150, null=True, blank=True)

    @property
    def string_id(self):
        """Retorna o identificador amigável do formulário (ex: formulario_001)."""
        return f"formulario_{self.id:03}"

    def __str__(self):
        ultima_versao = self.formularioschemas_set.order_by('-schema_version').first()
        versao = ultima_versao.schema_version if ultima_versao else "sem versão"
        return f"{self.nome} (v{versao})"

    class Meta:
        ordering = ['-data_criacao']

class FormularioSchemas(models.Model):
    formulario = models.ForeignKey(Formulario, on_delete=models.CASCADE)
    schema_version = models.IntegerField(default=1)
    is_ativo = models.BooleanField(default=True)
    protegido = models.BooleanField(default=False)

    # Controle de auditoria e remoção lógica
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_remocao = models.DateTimeField(null=True, blank=True)
    usuario_remocao = models.CharField(max_length=150, null=True, blank=True)

class Campo(models.Model):
    """Representa campos de uma versão de formulário (opcional caso não queira só JSON)."""
    TIPO_DE_CAMPO_CHOICES = [
        ('text', 'Texto'),
        ('number', 'Número'),
        ('date', 'Data'),
        ('select', 'Seleção'),
        ('boolean', 'Booleano'),
        ('calculated', 'Calculado'),
    ]

    schema = models.ForeignKey(FormularioSchemas, on_delete=models.CASCADE, related_name='campos')
    campo_id = models.CharField(max_length=100)
    label = models.CharField(max_length=255)
    tipo = models.CharField(max_length=20, choices=TIPO_DE_CAMPO_CHOICES)
    obrigatorio = models.BooleanField(default=False)
    multilinha = models.BooleanField(default=False)
    capitalizar = models.BooleanField(default=False)
    formula = models.TextField(blank=True, default="")
    condicional = models.TextField(blank=True, default="")
    dependencias = models.JSONField(default=list, blank=True)
    validacoes = models.JSONField(default=list, blank=True)
    opcoes = models.JSONField(default=list, blank=True)
    def __str__(self):
        return f"{self.label} ({self.tipo}) no schema v{self.schema.schema_version}"

    class Meta:
        unique_together = ('schema', 'campo_id')


class Resposta(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    formulario = models.ForeignKey(Formulario, on_delete=models.PROTECT, related_name='respostas')
    schema = models.ForeignKey(FormularioSchemas, on_delete=models.PROTECT)

    respostas = models.JSONField()
    calculados = models.JSONField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resposta {self.id} para {self.formulario.nome} (schema v{self.schema.schema_version})"

    class Meta:
        ordering = ['-criado_em']

