from rest_framework import serializers

from .models import Location, ProductProducer, ProductType, Product, Lot, Reagent

from datetime import date


def is_valid_range(from_date, until_date) -> bool:
    """
    Check if from_date is before until_date.
    If either is None, return True.
    """
    # check if their types are str
    from_date = (
        date.fromisoformat(from_date) if isinstance(from_date, str) else from_date
    )
    until_date = (
        date.fromisoformat(until_date) if isinstance(until_date, str) else until_date
    )

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
        fields = ["id", "name", "created_at"]
        read_only_fields = ["id", "created_at"]


class ProductProducerSerializer(serializers.ModelSerializer):
    """
    Serializer for ProductProducer model.
    """

    class Meta:
        model = ProductProducer
        fields = ["id", "name", "created_at"]
        read_only_fields = ["id", "created_at"]


class ProductTypeSerializer(serializers.ModelSerializer):
    """
    Serializer for ProductType model.
    """

    class Meta:
        model = ProductType
        fields = ["id", "name", "created_at"]
        read_only_fields = ["id", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for Product model.
    """

    producer = ProductProducerSerializer(read_only=True)
    type = ProductTypeSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "created_at",
            "article_number",
            "producer",
            "type",
        ]
        read_only_fields = ["id", "created_at"]


class LotReagentSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)

    class Meta:
        model = Reagent
        fields = ["id", "location", "amount"]
        read_only_fields = ["id"]


class LotSerializer(serializers.ModelSerializer):
    """
    Serializer for Lot model.
    """

    reagents = LotReagentSerializer(
        many=True,
        read_only=True,
    )
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True
    )

    class Meta:
        model = Lot
        fields = [
            "id",
            "name",
            "product",
            "product_id",
            "reagents",
            "valid_from",
            "valid_until",
            "created_at",
            "created_by",
            "is_empty",
        ]
        read_only_fields = ["id", "created_at", "is_empty"]

    def create(self, validated_data):
        # we need to manually pop the product_id from validated_data and create the lot with it
        product_id = validated_data.pop("product_id")
        lot = Lot.objects.create(**validated_data, product=product_id)
        lot.save()

        # create lot with each location, for future me: this could lead to a lot of errors
        # for example from here we suppose that all locations and all lots are present in the many-to-many table reagent
        # this may not be the case if a new location is created or a new lot is
        lot.location_set.add(
            *Location.objects.all(),
            through_defaults={"amount": 0, "created_by": lot.created_by}
        )

        return lot

    def validate(self, *args, **kwargs):
        # check if name and product combination is unique
        if Lot.objects.filter(
            name=self.initial_data.get("name", None),
            product=self.initial_data.get("product_id", None),
        ).exists():
            raise serializers.ValidationError(
                "Lot with this name and product already exists"
            )
        if self.instance:
            # if instance exists, check if name and product combination is unique
            if Lot.objects.filter(
                name=self.initial_data.get("name", None), product=self.instance.product
            ).exists():
                raise serializers.ValidationError(
                    "Lot with this name and product already exists"
                )
            # if instance exists, check if name and product combination is unique
            if Lot.objects.filter(
                name=self.instance.name,
                product=self.initial_data.get("product_id", None),
            ).exists():
                raise serializers.ValidationError(
                    "Lot with this name and typproduct already exists"
                )

        # check saved valid_from and valid_until
        old_valid_from = self.instance.valid_from if self.instance else None
        old_valid_until = self.instance.valid_until if self.instance else None
        valid_from = self.initial_data.get("valid_from", old_valid_from)
        valid_until = self.initial_data.get("valid_until", old_valid_until)

        if not is_valid_range(valid_from, valid_until):
            raise serializers.ValidationError("valid_from must be before valid_until")
        return super().validate(*args, **kwargs)

    # sort reagents by location__name
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["reagents"] = sorted(
            representation["reagents"], key=lambda x: x["location"]["name"]
        )
        return representation


class ReagentLotSerializer(serializers.ModelSerializer):
    """
    Serializer for Lot model. Used in ReagentSerializer to show the lot details.
    """

    class Meta:
        model = Lot
        fields = [
            "id",
            "name",
            "product",
            "valid_from",
            "valid_until",
            "is_empty",
        ]
        read_only_fields = [
            "id",
            "name",
            "product",
            "valid_from",
            "valid_until",
            "is_empty",
        ]


class ReagentSerializer(serializers.ModelSerializer):
    """
    Serializer for Reagent model.
    """

    lot = ReagentLotSerializer(read_only=True)
    lot_id = serializers.PrimaryKeyRelatedField(
        queryset=Lot.objects.all(), write_only=True
    )
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), write_only=True
    )

    class Meta:
        model = Reagent
        fields = [
            "id",
            "location",
            "location_id",
            "lot_id",
            "lot",
            "created_at",
            "created_by",
            "amount",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        # we need to manually pop the lot_id and location_id from validated_data and create the reagent with it
        lot = validated_data.pop("lot_id")
        location = validated_data.pop("location_id")
        return Reagent.objects.create(**validated_data, lot=lot, location=location)

    def validate_amount(self, value):
        # just make sure amount is not negative
        if value < 0:
            raise serializers.ValidationError("amount cannot be negative")
        return value

    def validate(self, *args, **kwargs):
        # lot and location should not be updated
        if self.instance:
            if self.initial_data.get("lot_id", None) is not None:
                raise serializers.ValidationError("lot cannot be changed")
            if self.initial_data.get("location_id", None) is not None:
                raise serializers.ValidationError("location cannot be changed")

        # check lot and location combination and make sure it is unique in the database
        lot_id = self.initial_data.get("lot_id", None)
        location_id = self.initial_data.get("location_id", None)
        if Reagent.objects.filter(lot=lot_id, location=location_id).exists():
            raise serializers.ValidationError(
                "Reagent with this lot and location already exists"
            )

        return super().validate(*args, **kwargs)
