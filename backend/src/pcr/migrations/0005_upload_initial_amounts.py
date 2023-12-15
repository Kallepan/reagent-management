from django.db import migrations

import os, csv, logging


def populate_table(apps, schema_editor):
    """Populates the tables with data"""
    Amount = apps.get_model("pcr", "Amount")
    Kind = apps.get_model("pcr", "Kind")
    Analysis = apps.get_model("pcr", "Analysis")

    with open(os.path.join(os.path.dirname(__file__), "0005_values.csv"), "r") as f:
        reader = csv.reader(f)

        # kind and analysis are foreign keys
        for row in reader:
            logging.info(f"Creating amount {row[0]} {row[1]} {row[2]}")
            kind = Kind.objects.get(name=row[0])
            analysis = Analysis.objects.get(name=row[1])

            amount, created = Amount.objects.get_or_create(
                value=row[2],
                kind=kind,
                analysis=analysis,
            )

            if created:
                amount.save()

    logging.info("Amounts populated.")


def empty_table(apps, schema_editor):
    """Empties the tables"""
    Amount = apps.get_model("pcr", "Amount")
    Amount.objects.all().delete()

    logging.info("Amounts emptied.")


class Migration(migrations.Migration):
    dependencies = [
        ("pcr", "0004_amount_amount_unique_kind_analysis_and_more"),
    ]

    operations = [
        migrations.RunPython(populate_table, empty_table),
    ]
