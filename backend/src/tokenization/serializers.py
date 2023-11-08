from typing import Any, Dict
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

from rest_framework import serializers

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
            raise InvalidToken('No valid token found in cookie')


class CookieTokenValidateSerializer(serializers.Serializer):
    token = None
    identifier = serializers.CharField(read_only=True)

    def validate(self, attrs):
        token = self.context['request'].COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])

        if token is None:
            raise InvalidToken('No valid token found in cookie')

        # validate the input token
        try:
            t = JWTAuthentication().get_validated_token(token)
        except InvalidToken as e:
            raise InvalidToken('No valid token found in cookie')

        # get the user from the token
        identifier = JWTAuthentication().get_user(t)

        # Add custom claims
        attrs['identifier'] = identifier.identifier

        return attrs