from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets, mixins, filters

from django_filters.rest_framework import DjangoFilterBackend

from .renderers import ResponseRenderer
from .permissions import IsAdminOrPcr
from .models import Kind, Analysis, Device, Batch, Reagent, Removal
from .serializers import (
    KindSerializer,
    AnalysisSerializer,
    DeviceSerializer,
    BatchSerializer,
    ReagentSerializer,
    RemovalSerializer,
)


class KindViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    """
    ViewSet for Kind model.
    """

    queryset = Kind.objects.all()
    serializer_class = KindSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrPcr]
    renderer_classes = [ResponseRenderer]


class AnalysisViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    """
    ViewSet for Analysis model.
    """

    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrPcr]
    renderer_classes = [ResponseRenderer]


class DeviceViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    """
    ViewSet for Device model.
    """

    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrPcr]
    renderer_classes = [ResponseRenderer]


class ReagentViewSet(
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    ViewSet for Reagent model.
    """

    queryset = Reagent.objects.all()
    serializer_class = ReagentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrPcr]
    renderer_classes = [ResponseRenderer]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = [
        "batch",
        "batch__kind",
        "is_empty",
        "batch__analysis",
        "batch__device",
    ]
    search_fields = [
        "batch__kind__name",
        "batch__analysis__name",
        "batch__device__name",
    ]


class BatchViewSet(
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    ViewSet for Batch model.
    """

    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrPcr]
    renderer_classes = [ResponseRenderer]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ["kind", "analysis", "device", "reagents__is_empty"]
    search_fields = ["kind__name", "analysis__name", "device__name", "reagents__id"]


class RemovalViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    ViewSet for Removal model.
    """

    queryset = Removal.objects.all()
    serializer_class = RemovalSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrPcr]
    renderer_classes = [ResponseRenderer]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
