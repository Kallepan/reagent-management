from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from .serializers import CookieTokenObtainPairSerializer, CookieTokenRefreshSerializer, CookieTokenVerifySerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

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
            cookie_max_age = 3600 * 24 * 7 # 7 days
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
        if response.data.get('access'):
            cookie_max_age = 3600 * 24 # 1 days
            response.set_cookie(
                'access_token', 
                response.data['access'], 
                max_age=cookie_max_age, 
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'], 
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            )
            del response.data['access']
            
        return super().finalize_response(request, response, *args, **kwargs)

class CookieTokenVerifyView(
    APIView,
):
    serializer_class = CookieTokenVerifySerializer
    
    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({'detail': str(e)}, status=400)
        
        return Response(serializer.validated_data, status=200)
    

class CookieTokenLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response()
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

@api_view(['GET'])
def has_access_view(request, *args, **kwargs):
    """ Function to check if a user has access to a given feature flag."""

    # Get the feature flag name from the request
    feature_flag = kwargs.get('feature_flag', None)

    # If the feature flag is not set, return a 400
    if feature_flag is None:
        return Response({'detail': 'Feature flag not set'}, status=400)

    if not request.user.is_authenticated:
        return Response(None, status=401)
    
    # Allow superusers to access all feature flags
    if request.user.is_admin:
        return Response(None, status=200)

    # If the feature flag is set, check if the user has access to it
    if request.user.groups.filter(name=feature_flag).exists():
        return Response(None, status=200)

    # If the user does not have access to the feature flag, return a 403
    return Response(None, status=403)