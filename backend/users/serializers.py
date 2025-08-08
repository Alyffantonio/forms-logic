from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para exibir informações básicas do usuário (sem a senha).
    """
    class Meta:
        model = User
        fields = ['id', 'username']

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer para registrar um novo usuário.
    """
    # Adiciona campos extras para a senha e sua confirmação
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, label="Confirmar Senha")

    class Meta:
        model = User
        fields = ('username', 'password', 'password_confirm')
        extra_kwargs = {
            'username': {'required': True}
        }

    def validate(self, attrs):
        """
        Validação customizada para garantir que as senhas coincidem.
        """
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        return attrs

    def create(self, validated_data):
        """
        Cria e salva um novo usuário no banco de dados.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user