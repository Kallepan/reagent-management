from rest_framework import routers

from .views import (
    AnalysisViewSet,
    ReagentViewSet,
    KindViewSet,
    DeviceViewSet,
    BatchViewSet,
    RemovalViewSet,
    AmountViewSet,
    RecRemovalCountsViewset,
)

router = routers.SimpleRouter()

router.register(r"analyses", AnalysisViewSet)
router.register(r"reagents", ReagentViewSet)
router.register(r"kinds", KindViewSet)
router.register(r"devices", DeviceViewSet)
router.register(r"batches", BatchViewSet)
router.register(r"removals", RemovalViewSet)
router.register(r"amounts", AmountViewSet)
router.register(r"recommended_removals", RecRemovalCountsViewset)
urlpatterns = []

urlpatterns += router.urls
