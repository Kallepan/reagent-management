from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()

class TokenObtainPairViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            identifier='testuser', password='testpass', email='testuser@example.com')
        self.token = RefreshToken.for_user(self.user)
        self.access_token = str(self.token.access_token)

    def test_token_obtain_pair_view(self):
        response = self.client.post(reverse('token_obtain_pair'), {
            'identifier': 'testuser',
            'password': 'testpass'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_token_refresh_view(self):
        response = self.client.post(
            reverse('token_refresh'), {
                'refresh': str(self.token),
            }, 
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)