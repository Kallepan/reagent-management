from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from .serializers import CookieTokenObtainPairSerializer, CookieTokenRefreshSerializer, CookieTokenValidateSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

from django.conf import settings

class CookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = CookieTokenObtainPairSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('access'):
            cookie_max_age = 3600 * 24 # 1 day
            response.set_cookie(
                'access_token', 
                response.data['access'],  
                max_age=cookie_max_age, 
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'], 
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            )
            del response.data['access']
            
        if response.data.get('refresh'):
            cookie_max_age = 3600 * 24 * 14 # 14 days
            response.set_cookie(
                'refresh_token', 
                response.data['refresh'],  
                max_age=cookie_max_age, 
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'], 
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            )
            del response.data['refresh']

        return super().finalize_response(request, response, *args, **kwargs)

class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            cookie_max_age = 3600 * 24 * 14 # 14 days
            response.set_cookie(
                'refresh_token', 
                response.data['refresh'], 
                max_age=cookie_max_age, 
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'], 
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            )
            del response.data['refresh']
            
        return super().finalize_response(request, response, *args, **kwargs)

class CookieTokenVerifyView(
    APIView,
):
    serializer_class = CookieTokenValidateSerializer
    
    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({'detail': str(e)}, status=400)
        
        return Response(serializer.validated_data, status=200)