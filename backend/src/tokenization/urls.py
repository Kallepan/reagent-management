from django.urls import path
from .views import CookieTokenObtainPairView, CookieTokenRefreshView, CookieTokenVerifyView, CookieTokenLogoutView

urlpatterns = [
    path('', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', CookieTokenLogoutView.as_view(), name='token_logout'),
    path('verify/', CookieTokenVerifyView.as_view(), name='token_verify'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
]