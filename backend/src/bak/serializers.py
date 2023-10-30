from rest_framework import serializers

from .models import Location, Type, Lot, Reagent

class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer for Location model.
    """

    class Meta:
        model = Location
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']

class TypeSerializer(serializers.ModelSerializer):
    """
    Serializer for Type model.
    """

    class Meta:
        model = Type
        fields = ['id', 'name', 'producer', 'created_at', 'lots']
        read_only_fields = ['id', 'created_at']

class LotSerializer(serializers.ModelSerializer):
    """
    Serializer for Lot model.
    """

    class Meta:
        model = Lot
        fields = ['id', 'name', 'type', 'valid_from', 'valid_until', 'created_at', 'created_by', 'in_use_from', 'in_use_until']
        read_only_fields = ['id', 'created_at']

class ReagentSerializer(serializers.ModelSerializer):
    """
    Serializer for Reagent model.
    """

    class Meta:
        model = Reagent
        fields = ['id', 'lot', 'location', 'created_at', 'created_by', 'amount']
        read_only_fields = ['id', 'created_at']