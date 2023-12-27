from typing import Any
from django.db import models
from django.core.validators import MinValueValidator

from datetime import datetime

import uuid


# Create your models here.
class Kind(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, db_index=True)

    class Meta:
        db_table = 'pcr"."kind'
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Analysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=20, db_index=True)

    class Meta:
        db_table = 'pcr"."analysis'
        ordering = ["name"]
        verbose_name_plural = "Analyses"

    def __str__(self) -> str:
        return self.name


class Device(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, db_index=True)

    class Meta:
        db_table = 'pcr"."device'
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Batch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    kind = models.ForeignKey(Kind, on_delete=models.CASCADE, related_name="batches")
    analysis = models.ForeignKey(
        Analysis, on_delete=models.CASCADE, related_name="batches"
    )
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="batches")

    comment = models.TextField(null=True, blank=True)

    # auto fields:
    first_opened_at = models.DateTimeField(null=True, blank=True)
    first_opened_by = models.CharField(max_length=100, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100)

    class Meta:
        db_table = 'pcr"."batch'
        ordering = ["kind", "analysis", "device"]
        verbose_name_plural = "Batches"

    def __str__(self) -> str:
        return f"{self.id} ({self.kind}-{self.analysis}-{self.device})"


class Reagent(models.Model):
    # Here we use a predetermined ID instead of a UUID.
    # This id is present on the reagent itself and is used to identify it.
    id = models.CharField(primary_key=True, max_length=50)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="reagents")
    initial_amount = models.IntegerField(default=1, validators=[MinValueValidator(1)])

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100)

    # This field is used to indicate if the reagent is empty.
    # It is automatically set to True when the sum of all removals is equal to the initial amount.
    is_empty = models.BooleanField(default=False, editable=False)

    class Meta:
        db_table = 'pcr"."reagent'

    def __str__(self) -> str:
        return f"{self.id} ({self.batch})"

    @property
    def current_amount(self):
        # Returns the current amount of the reagent. i.e. the initial amount minus the sum of all removals.
        return self.initial_amount - (
            self.removals.aggregate(amount__sum=models.Sum("amount"))["amount__sum"]
            or 0
        )

    def save(self, *args, **kwargs):
        if self.current_amount == 0:
            self.is_empty = True

        super(Reagent, self).save(*args, **kwargs)


class Removal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reagent = models.ForeignKey(
        Reagent, on_delete=models.CASCADE, related_name="removals"
    )
    amount = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    comment = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100)

    class Meta:
        db_table = 'pcr"."removal'
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.reagent} ({self.amount})"

    def delete(self, *args, **kwargs):
        # Automatically sets the is_empty field to False if the reagent is not empty.
        # Deletion of a removal means that the associated reagent is not empty anymore.
        super(Removal, self).delete(*args, **kwargs)

        if self.reagent.current_amount != 0:
            self.reagent.is_empty = False
            self.reagent.save()

    def save(self, *args, **kwargs):
        # If this is the first removal of a batch then set the first_opened_at and first_opened_by fields.
        if self.reagent.batch.first_opened_at is None:
            self.reagent.batch.first_opened_at = datetime.now()
            self.reagent.batch.first_opened_by = self.created_by
            self.reagent.batch.save()

        # Automatically sets the is_empty field to True if the reagent is empty.
        if self.reagent.current_amount == self.amount:
            self.reagent.is_empty = True
            self.reagent.save()

        super(Removal, self).save(*args, **kwargs)


class RecRemovalCounts(models.Model):
    """
    This class stores the recommended maximal removal counts for each combination of kind and analysis.
    """

    # Technically we only need a composite key of kind and analysis. But Django does not support composite keys.
    # So we use a UUID as primary key and add a unique constraint on kind and analysis.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    kind = models.ForeignKey(Kind, on_delete=models.CASCADE, related_name="counts")
    analysis = models.ForeignKey(
        Analysis, on_delete=models.CASCADE, related_name="counts"
    )

    value = models.IntegerField(default=1, validators=[MinValueValidator(1)])

    class Meta:
        verbose_name_plural = "Recommended removal counts"
        db_table = 'pcr"."removal_counts'
        ordering = ["kind", "analysis"]
        constraints = [
            models.UniqueConstraint(
                fields=["kind", "analysis"], name="unique_kind_analysis_rec_removals"
            )
        ]
        index_together = ["kind", "analysis"]

    def __str__(self) -> str:
        return f"{self.kind} - {self.analysis} ({self.value})"


class Amount(models.Model):
    """
    This class keeps track of all default amounts of reagents for each combination of kind and analysis.
    """

    # Technically we only need a composite key of kind and analysis. But Django does not support composite keys.
    # So we use a UUID as primary key and add a unique constraint on kind and analysis.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    kind = models.ForeignKey(Kind, on_delete=models.CASCADE, related_name="amounts")
    analysis = models.ForeignKey(
        Analysis, on_delete=models.CASCADE, related_name="amounts"
    )

    # Set default to 4 because that is the most common amount.
    value = models.IntegerField(default=4, validators=[MinValueValidator(1)])

    class Meta:
        db_table = 'pcr"."amount'
        ordering = ["kind", "analysis"]
        constraints = [
            models.UniqueConstraint(
                fields=["kind", "analysis"], name="unique_kind_analysis_amounts"
            )
        ]
        index_together = ["kind", "analysis"]

    def __str__(self) -> str:
        return f"{self.kind} - {self.analysis} ({self.value})"
