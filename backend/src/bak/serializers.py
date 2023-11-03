from rest_framework import serializers
from rest_framework.fields import empty

from .models import Location, Type, Lot, Reagent

import uuid
from datetime import date

def is_valid_range(from_date, until_date) -> bool:
    """
    Check if from_date is before until_date.
    If either is None, return True.
    """
    # check if their types are str
    from_date = date.fromisoformat(from_date) if isinstance(from_date, str) else from_date
    until_date = date.fromisoformat(until_date) if isinstance(until_date, str) else until_date

    # if both are not None, return True if from_date is before until_date
    if from_date is not None and until_date is not None:
        return from_date < until_date
    
    # if either is None, return True
    return True

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
        fields = ['id', 'name', 'producer', 'created_at']
        read_only_fields = ['id', 'created_at']

class LotReagentSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)

    class Meta:
        model = Reagent
        fields = ['id', 'location', 'amount']
        read_only_fields = ['id']

class LotSerializer(serializers.ModelSerializer):
    """
    Serializer for Lot model.
    """
    reagents = LotReagentSerializer(many=True, read_only=True)
    type = TypeSerializer(read_only=True)
    type_id = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all(), write_only=True)

    class Meta:
        model = Lot
        fields = [
            'id', 
            'name', 
            'type',
            'type_id',
            'reagents', 
            'valid_from', 
            'valid_until',
            'created_at', 
            'created_by',
            'in_use_from', 
            'in_use_until', 
            'is_empty'
        ]
        read_only_fields = ['id', 'created_at', 'is_empty']

    def create(self, validated_data):
        # we need to manually pop the type_id from validated_data and create the lot with it
        type_id = validated_data.pop('type_id')
        lot = Lot.objects.create(**validated_data, type=type_id)
        lot.save()

        # create lot with each location, for future me: this could lead to a lot of errors
        # for example from here we suppose that all locations and all lots are present in the many-to-many table reagent
        # this may not be the case if a new location is created or a new lot is
        lot.location_set.add(*Location.objects.all(), through_defaults={'amount': 0, 'created_by': lot.created_by})

        return lot

    def validate(self, *args, **kwargs):
        # check if name and type combination is unique
        if Lot.objects.filter(name=self.initial_data.get('name', None), type=self.initial_data.get('type_id', None)).exists():
            raise serializers.ValidationError("Lot with this name and type already exists")
        if self.instance:
            # if instance exists, check if name and type combination is unique
            if Lot.objects.filter(name=self.initial_data.get('name', None), type=self.instance.type).exists():
                raise serializers.ValidationError("Lot with this name and type already exists")
            # if instance exists, check if name and type combination is unique
            if Lot.objects.filter(name=self.instance.name, type=self.initial_data.get('type_id', None)).exists():
                raise serializers.ValidationError("Lot with this name and type already exists")
        
        # check saved valid_from and valid_until 
        old_valid_from = self.instance.valid_from if self.instance else None
        old_valid_until = self.instance.valid_until if self.instance else None
        valid_from = self.initial_data.get('valid_from', old_valid_from)
        valid_until = self.initial_data.get('valid_until', old_valid_until)

        if not is_valid_range(valid_from, valid_until):
            raise serializers.ValidationError("valid_from must be before valid_until")

        # check if in_use_from and in_use_until are valid
        old_in_use_from = self.instance.in_use_from if self.instance else None
        old_in_use_until = self.instance.in_use_until if self.instance else None
        in_use_from = self.initial_data.get('in_use_from', old_in_use_from)
        in_use_until = self.initial_data.get('in_use_until', old_in_use_until)

        if not is_valid_range(in_use_from, in_use_until):
            raise serializers.ValidationError("in_use_from must be before in_use_until")
  
        return super().validate(*args, **kwargs)


class ReagentLotSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lot
        fields = ['id', 'name', 'type', 'valid_from', 'valid_until', 'in_use_from', 'in_use_until', 'is_empty']
        read_only_fields = ['id', 'name', 'type', 'valid_from', 'valid_until', 'in_use_from', 'in_use_until', 'is_empty']
    
class ReagentSerializer(serializers.ModelSerializer):
    """
    Serializer for Reagent model.
    """
    lot = ReagentLotSerializer(read_only=True)
    lot_id = serializers.PrimaryKeyRelatedField(queryset=Lot.objects.all(), write_only=True)
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all(), write_only=True)

    class Meta:
        model = Reagent
        fields = [
            'id', 
            'location', 
            'location_id', 
            'lot_id',
            'lot',
            'created_at', 
            'created_by', 
            'amount',
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        # we need to manually pop the lot_id and location_id from validated_data and create the reagent with it
        lot = validated_data.pop('lot_id')
        location = validated_data.pop('location_id')
        return Reagent.objects.create(**validated_data, lot=lot, location=location)

    def validate_amount(self, value):
        # just make sure amount is not negative
        if value < 0:
            raise serializers.ValidationError("amount cannot be negative")
        return value

    def validate(self, *args, **kwargs):
        # lot and location should not be updated
        if self.instance:
            if self.initial_data.get('lot_id', None) is not None:
                raise serializers.ValidationError("lot cannot be changed")
            if self.initial_data.get('location_id', None) is not None:
                raise serializers.ValidationError("location cannot be changed")

        # check lot and location combination and make sure it is unique in the database
        lot_id = self.initial_data.get('lot_id', None)
        location_id = self.initial_data.get('location_id', None)
        if Reagent.objects.filter(lot=lot_id, location=location_id).exists():
            raise serializers.ValidationError("Reagent with this lot and location already exists")

        return super().validate(*args, **kwargs)