from django.db import models
from django.core.validators import MinValueValidator
from django.db.models.constraints import UniqueConstraint

class Location(models.Model):
    """Location model at which reagents are stored."""
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=100, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bak"."location'

class ReagentType(models.Model):
    """
    Reagent type model.
    Describes the differing types of reagents. E.g. "Blood", "KV", "Sab", etc.
    """ 
    name = models.CharField(max_length=50, primary_key=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bak"."reagent_type'

class Lot(models.Model):
    """
    Lot model.
    Describes the different lots of reagents. E.g. "3", "Lot 2", etc.
    """
    id = models.UUIDField(primary_key=True, db_index=True)
    name = models.CharField(max_length=50, db_index=True)

    valid_from = models.DateField(null=True, blank=True)
    valid_until = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100)

    in_use_from = models.DateField(null=True, blank=True)
    in_use_until = models.DateField(null=True, blank=True)
    
    class Meta:
        db_table = 'bak"."lot'	

class Reagent(models.Model):
    """
    Actual reagent model which keeps track of the amount of reagent in stock.
    """
    # Unique constraint on type, location and lot
    type = models.ForeignKey(ReagentType, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    lot = models.ForeignKey(Lot, on_delete=models.CASCADE)

    amount = models.IntegerField(
        default=0,
        db_index=True,
        validators=[MinValueValidator(0)]
    )

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100)

    @property
    def is_empty(self) -> bool:
        return self.amount == 0

    class Meta:
        db_table = 'bak"."reagent'
        constraints = [
            UniqueConstraint(fields=[
                'type', 'location', 'lot'
            ], name='unique_reagent')
        ]
        index_together = [
            ['type', 'location', 'lot']
        ]
