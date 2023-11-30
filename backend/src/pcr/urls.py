from rest_framework import routers

from .views import AnalysisViewSet, ReagentViewSet, KindViewSet, DeviceViewSet, BatchViewSet

router = routers.SimpleRouter()

router.register(r'analyses', AnalysisViewSet)
router.register(r'reagents', ReagentViewSet)
router.register(r'kinds', KindViewSet)
router.register(r'devices', DeviceViewSet)
router.register(r'batches', BatchViewSet)

urlpatterns = []

urlpatterns += router.urls