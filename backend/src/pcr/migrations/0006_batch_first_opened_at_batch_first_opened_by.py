# Generated by Django 4.2.6 on 2023-12-15 10:23

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("pcr", "0005_upload_initial_amounts"),
    ]

    operations = [
        migrations.AddField(
            model_name="batch",
            name="first_opened_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="batch",
            name="first_opened_by",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
