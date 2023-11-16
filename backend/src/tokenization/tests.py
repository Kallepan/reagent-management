from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

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
        
        # should not be present due to using cookies instead of json
        self.assertNotIn('access', response.data)
        self.assertNotIn('refresh', response.data)
    
    def test_user_does_not_exist(self):
        response = self.client.post(reverse('token_obtain_pair'), {
            'identifier': 'testuser2',
            'password': 'testpass'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TokenRefreshViewTestCase(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.user = User.objects.create_user(
            identifier='testuser', password='testpass', email='test@example.com')
        self.token = RefreshToken.for_user(self.user)
        self.access_token = str(self.token.access_token)
        self.refresh_token = str(self.token)
    
    def test_token_refresh_view(self):
        self.client.cookies['refresh_token'] = self.refresh_token

        response = self.client.post(reverse('token_refresh'), None, format='json', )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn('access', response.data)
        self.assertNotIn('refresh', response.data)

        # check if the cookie is set
        self.assertIn('access_token', response.cookies)

class TokenVerifyViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            identifier='testuser', password='testpass', email='test@example.com')
        self.token = RefreshToken.for_user(self.user)
        self.access_token = str(self.token.access_token)
        self.refresh_token = str(self.token)

    def test_token_verify_view(self):
        self.client.cookies['access_token'] = self.access_token

        response = self.client.get(reverse('token_verify'), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn('access', response.data)
        self.assertNotIn('refresh', response.data)
        self.assertEqual(response.data['identifier'], 'testuser')

    def test_no_cookie(self):
        response = self.client.get(reverse('token_verify'), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
class TokenLogoutViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            identifier='testuser', password='testpass', email='test@example.com')
        self.token = RefreshToken.for_user(self.user)
        self.access_token = str(self.token.access_token)
        self.refresh_token = str(self.token)
    
    def test_token_logout_view(self):
        self.client.cookies['access_token'] = self.access_token
        self.client.cookies['refresh_token'] = self.refresh_token

        response = self.client.post(reverse('token_logout'), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
        # check if the cookies are deleted
        self.assertEqual(response.cookies['access_token'].value, '')
        self.assertEqual(response.cookies['refresh_token'].value, '')

class HasAccessViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            identifier='testuser', password='testpass',email='test@example.com')
        self.token = RefreshToken.for_user(self.user)
        self.access_token = str(self.token.access_token)
        self.refresh_token = str(self.token)

        self.group = Group.objects.create(name='test')
        self.user.groups.add(self.group)
    
    def test_has_access_view(self):
        self.client.cookies['access_token'] = self.access_token

        response = self.client.get(reverse('has_access', kwargs={'feature_flag': 'test'}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, None)

    def test_has_access_view_no_access(self):
        self.client.cookies['access_token'] = self.access_token

        response = self.client.get(reverse('has_access', kwargs={'feature_flag': 'test2'}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_has_access_view_no_cookie(self):
        response = self.client.get(reverse('has_access', kwargs={'feature_flag': 'test'}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)