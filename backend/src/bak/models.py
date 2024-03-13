from django.db import models
from django.core.validators import MinValueValidator
from django.db.models.constraints import UniqueConstraint, CheckConstraint

import uuid


class Location(models.Model):
    """Location model at which reagents are stored."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, db_index=True, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bak"."location'
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class ProductType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, db_index=True, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bak"."product_type'
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class ProductProducer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, db_index=True, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bak"."product_producer'
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    """
    The reagent product.
    Describes the differing products of reagents. E.g. "Blood", "KV", "Sab", etc.
    """

    id = models.UUIDField(
        primary_key=True, db_index=True, default=uuid.uuid4, editable=False
    )
    name = models.CharField(max_length=50, db_index=True)
    producer = models.ForeignKey(
        ProductProducer, on_delete=models.CASCADE, related_name="products"
    )
    type = models.ForeignKey(
        ProductType,
        on_delete=models.CASCADE,
        related_name="products",
    )

    article_number = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bak"."product'
        index_together = [
            [
                "name",
                "producer",
                "article_number",
            ]
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.producer.name}, {self.type.name})"


class Lot(models.Model):
    """
    Lot model.
    Describes the different lots of reagents. E.g. "3", "Lot 2", etc.
    """

    id = models.UUIDField(
        primary_key=True, db_index=True, default=uuid.uuid4, editable=False
    )
    name = models.CharField(max_length=50, db_index=True)

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="lots")

    valid_from = models.DateField(null=True, blank=True)
    valid_until = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100)

    location_set = models.ManyToManyField(Location, through="Reagent")

    class Meta:
        db_table = 'bak"."lot'
        index_together = [["name", "product"]]
        constraints = [
            UniqueConstraint(fields=["name", "product"], name="unique_lot"),
        ]

    # check if all reagents of this lot are empty
    @property
    def is_empty(self) -> bool:
        return self.reagents.filter(amount__gt=0).count() == 0

    def __str__(self) -> str:
        return f"{self.name} ({self.product})"


class Reagent(models.Model):
    """
    Actual reagent model which keeps track of the amount of reagent in stock.
    """

    # Unique constraint on product, location and lot
    id = models.UUIDField(
        primary_key=True, db_index=True, default=uuid.uuid4, editable=False
    )
    location = models.ForeignKey(
        Location, on_delete=models.CASCADE, related_name="reagents"
    )
    lot = models.ForeignKey(Lot, on_delete=models.CASCADE, related_name="reagents")

    amount = models.IntegerField(
        default=0, db_index=True, validators=[MinValueValidator(0)]
    )

    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_empty(self) -> bool:
        return self.amount == 0

    class Meta:
        db_table = 'bak"."reagent'
        constraints = [
            UniqueConstraint(fields=["location", "lot"], name="unique_reagent")
        ]
        index_together = [["location", "lot"]]

    def __str__(self) -> str:
        return f"{self.lot} ({self.location})"
