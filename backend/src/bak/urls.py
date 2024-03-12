from rest_framework import routers

from .views import LocationViewSet, ProductViewSet, LotViewSet, ReagentViewSet

router = routers.SimpleRouter()

router.register(r"locations", LocationViewSet)
router.register(r"products", ProductViewSet)
router.register(r"lots", LotViewSet)
router.register(r"reagents", ReagentViewSet)

urlpatterns = []

urlpatterns += router.urls
