from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets, mixins, filters

from django_filters.rest_framework import DjangoFilterBackend

from django.db.models import Q

from .models import Location, Type, Lot, Reagent
from .serializers import LocationSerializer, TypeSerializer, LotSerializer, ReagentSerializer
from .renderers import ResponseRenderer
from .permissions import IsAdminOrBak

class LocationViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """
    ViewSet for Location model.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrBak]
    renderer_classes = [ResponseRenderer]

class TypeViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """
    ViewSet for Type model.
    """
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrBak]
    renderer_classes = [ResponseRenderer]

class LotViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Lot.objects.all()
    serializer_class = LotSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrBak]
    renderer_classes = [ResponseRenderer]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = [
        'name', 
        'type', 
        'reagents__amount', 
    ]
    search_fields = [
        '@name',
        '@type__name',
        '@type__producer',
        '@reagents__location__name',
    ]

    def get_queryset(self):
        """ Filter out all empty lots if  the param is_empty is set to True. """
        queryset = Lot.objects.all()

        # WE must filter here because I don't know how to filter on a property in the serializer
        is_empty = self.request.query_params.get('is_empty', None)
        if is_empty is not  None:        
            if is_empty == 'true':
                # filter either no reagents or all reagents with amount 0
                queryset = queryset.complex_filter(
                    Q(reagents__isnull=True) | Q(reagents__amount=0)
                ).distinct()
            elif is_empty == 'false':
                queryset = queryset.filter(reagents__amount__gt=0).distinct()
        return queryset
    
class ReagentViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Reagent.objects.all()
    serializer_class = ReagentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrBak]
    renderer_classes = [ResponseRenderer]
    filterset_fields = ['amount', 'lot']