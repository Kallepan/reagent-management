# Generated by Django 4.2.6 on 2023-11-30 16:00

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("pcr", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Analysis",
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
                ("name", models.CharField(db_index=True, max_length=20)),
            ],
            options={
                "verbose_name_plural": "Analyses",
                "db_table": 'pcr"."analysis',
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Batch",
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
                ("comment", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("created_by", models.CharField(max_length=100)),
                (
                    "analysis",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="batches",
                        to="pcr.analysis",
                    ),
                ),
            ],
            options={
                "db_table": 'pcr"."batch',
                "ordering": ["kind", "analysis", "device"],
                "verbose_name_plural": "Batches",
            },
        ),
        migrations.CreateModel(
            name="Device",
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
                ("name", models.CharField(db_index=True, max_length=50)),
            ],
            options={
                "db_table": 'pcr"."device',
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Kind",
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
                ("name", models.CharField(db_index=True, max_length=50)),
            ],
            options={
                "db_table": 'pcr"."kind',
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Reagent",
            fields=[
                (
                    "id",
                    models.CharField(
                        max_length=50, primary_key=True, serialize=False
                    ),
                ),
                (
                    "initial_amount",
                    models.IntegerField(
                        default=1,
                        validators=[django.core.validators.MinValueValidator(1)],
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("created_by", models.CharField(max_length=100)),
                ("is_empty", models.BooleanField(default=False, editable=False)),
                (
                    "batch",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reagents",
                        to="pcr.batch",
                    ),
                ),
            ],
            options={
                "db_table": 'pcr"."reagent',
            },
        ),
        migrations.CreateModel(
            name="Removal",
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
                    "amount",
                    models.IntegerField(
                        default=0,
                        validators=[django.core.validators.MinValueValidator(0)],
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("created_by", models.CharField(max_length=100)),
                (
                    "reagent",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="removals",
                        to="pcr.reagent",
                    ),
                ),
            ],
            options={
                "db_table": 'pcr"."removal',
                "ordering": ["created_at"],
            },
        ),
        migrations.AddField(
            model_name="batch",
            name="device",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="batches",
                to="pcr.device",
            ),
        ),
        migrations.AddField(
            model_name="batch",
            name="kind",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="batches",
                to="pcr.kind",
            ),
        ),
    ]
