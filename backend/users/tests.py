from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token

User = get_user_model()


class UserAuthAPITests(APITestCase):

    def setUp(self):
        self.register_url = '/api/v1/auth/register/'
        self.login_url = '/api/v1/auth/login/'
        self.logout_url = '/api/v1/auth/logout/'

        self.user_data = {
            'username': 'testuser',
            'password': 'strongpassword123',
            'password_confirm': 'strongpassword123'
        }

    def test_registrar_usuario_com_sucesso(self):
        response = self.client.post(self.register_url, self.user_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')
        self.assertIn('token', response.data)

    def test_falha_registrar_usuario_com_senhas_diferentes(self):
        invalid_data = self.user_data.copy()
        invalid_data['password_confirm'] = 'differentpassword'

        response = self.client.post(self.register_url, invalid_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
        self.assertIn("As senhas não coincidem.", str(response.data))

    def test_login_usuario_com_sucesso(self):
        User.objects.create_user(username='testuser', password='strongpassword123')

        login_data = {
            'username': 'testuser',
            'password': 'strongpassword123'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_falha_login_com_credenciais_invalidas(self):
        User.objects.create_user(username='testuser', password='strongpassword123')

        invalid_login_data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }

        response = self.client.post(self.login_url, invalid_login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Credenciais inválidas.')

    def test_logout_usuario_com_sucesso(self):
        user = User.objects.create_user(username='testuser', password='strongpassword123')
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        self.assertTrue(Token.objects.filter(user=user).exists())

        response = self.client.post(self.logout_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Token.objects.filter(user=user).exists())