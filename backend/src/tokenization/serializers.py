from typing import Any, Dict
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.exceptions import InvalidToken

from django.conf import settings

class CookieTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        attrs['access'] = self.context['request'].COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        attrs['refresh'] = self.context['request'].COOKIES.get(settings.SIMPLE_JWT['REFRESH_COOKIE'])
        
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user) -> Token:
        token = super().get_token(user)

        # Add custom claims
        token['identifier'] = user.identifier

        return token

class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get(settings.SIMPLE_JWT['REFRESH_COOKIE'])
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken('No valid token found in cookie \'refresh_token\'')
