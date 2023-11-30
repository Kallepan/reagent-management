from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

import uuid

# Create your models here.
class Kind(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, db_index=True)

    class Meta:
        db_table = 'pcr"."kind'
        ordering = ['name']
    
    def __str__(self) -> str:
        return self.name

class Analysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=5, db_index=True)

    class Meta:
        db_table = 'pcr"."analysis'
        ordering = ['name']
        verbose_name_plural = 'Analyses'
        
    
    def __str__(self) -> str:
        return self.name

class Device(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, db_index=True)

    class Meta:
        db_table = 'pcr"."device'
        ordering = ['name']
    
    def __str__(self) -> str:
        return self.name

class Batch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    kind = models.ForeignKey(Kind, on_delete=models.CASCADE, related_name='batches')
    analysis = models.ForeignKey(Analysis, on_delete=models.CASCADE, related_name='batches')
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='batches')

    comment = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100)

    class Meta:
        db_table = 'pcr"."batch'
        ordering = ['kind', 'analysis', 'device']
    
    def __str__(self) -> str:
        return f'{self.kind}-{self.analysis}-{self.device}'
    

class Reagent(models.Model):
    # Here we use a predetermined ID instead of a UUID.
    # This id is present on the reagent itself and is used to identify it.
    id = models.CharField(primary_key=True, max_length=50, editable=False)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='reagents')
    initial_amount = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100)

    # This field is used to indicate if the reagent is empty.
    # It is automatically set to True when the sum of all removals is equal to the initial amount.
    is_empty = models.BooleanField(default=False, editable=False)

    class Meta:
        db_table = 'pcr"."reagent'

    def __str__(self) -> str:
        return f'{self.id} ({self.batch})'
    
    @property
    def current_amount(self):
        # Returns the current amount of the reagent. i.e. the initial amount minus the sum of all removals.
        return self.initial_amount - (self.removals.aggregate(models.Sum('amount'))['amount__sum'] or 0)

    def save(self, *args, **kwargs):
        if self.current_amount == 0:
            self.is_empty = True
        super().save(*args, **kwargs)

class Removal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reagent = models.ForeignKey(Reagent, on_delete=models.CASCADE, related_name='removals')
    amount = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100)

    class Meta:
        db_table = 'pcr"."removal'
        ordering = ['created_at']
    
    def __str__(self) -> str:
        return f'{self.reagent} ({self.amount})'
    
    def save(self, *args, **kwargs):
        # Automatically sets the is_empty field to True if the reagent is empty.
        if self.reagent.current_amount == self.amount:
            self.reagent.is_empty = True
            self.reagent.save()
            
        super().save(*args, **kwargs)