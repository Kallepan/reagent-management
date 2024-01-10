# Generated by Django 4.2.6 on 2023-12-27 15:20

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    dependencies = [
        ("pcr", "0006_batch_first_opened_at_batch_first_opened_by"),
    ]

    operations = [
        migrations.CreateModel(
            name="RecRemovalCounts",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "value",
                    models.IntegerField(
                        default=1,
                        validators=[django.core.validators.MinValueValidator(1)],
                    ),
                ),
                (
                    "analysis",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="counts",
                        to="pcr.analysis",
                    ),
                ),
                (
                    "kind",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="counts",
                        to="pcr.kind",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Recommended removal counts",
                "db_table": 'pcr"."removal_counts',
                "ordering": ["kind", "analysis"],
            },
        ),
        migrations.AddConstraint(
            model_name="recremovalcounts",
            constraint=models.UniqueConstraint(
                fields=("kind", "analysis"), name="unique_kind_analysis_rec_removals"
            ),
        ),
        migrations.AlterIndexTogether(
            name="recremovalcounts",
            index_together={("kind", "analysis")},
        ),
    ]
