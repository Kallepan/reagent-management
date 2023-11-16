from django.test import TestCase
from django.contrib.auth import get_user_model

from .serializers import CookieTokenObtainPairSerializer

User = get_user_model()

class CookieTokenObtainPairSerializerTest(TestCase):
    def setUp(self):
        self.serializer = CookieTokenObtainPairSerializer()

    def test_cookie_token_obtain_pair_serializer(self):
        """
        Test that the serializer returns the correct token
        """
        user = User.objects.create_user(
            identifier='test', password='test', email='test@example.com')

        token = self.serializer.get_token(user)
        
        # check if the token contains the identifier
        self.assertEqual(token['identifier'], 'test')
        
        # should contain nothing else
        self.assertEqual(token.payload.keys(), {'token_type', 'iat','exp', 'jti', 'user_id', 'identifier'})
        