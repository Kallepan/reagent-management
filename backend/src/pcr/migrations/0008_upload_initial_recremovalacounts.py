from django.db import migrations

REC_REMOVALS = [
    {"kind": "Mastermix", "analysis": "CMV", "value": 5},
    {"kind": "Mastermix", "analysis": "EBV", "value": 7},
    {"kind": "Mastermix", "analysis": "PNJI", "value": 7},
    {"kind": "Mastermix", "analysis": "CLOS", "value": 10},
]


def populate_table(apps, schema_editor):
    """Populates the initial recommended removal counts"""
    RecRemovalCounts = apps.get_model("pcr", "RecRemovalCounts")
    Analysis = apps.get_model("pcr", "Analysis")
    Kind = apps.get_model("pcr", "Kind")
    for rec_removal_data in REC_REMOVALS:
        kind = Kind.objects.get(name=rec_removal_data["kind"])
        analysis = Analysis.objects.get(name=rec_removal_data["analysis"])

        rec_removal_obj = RecRemovalCounts.objects.create(
            value=rec_removal_data["value"],
            kind=kind,
            analysis=analysis,
        )

        rec_removal_obj.save()


def reverse_table(apps, schema_editor):
    """Empties the initial recommended removal counts"""
    RecRemovalCounts = apps.get_model("pcr", "RecRemovalCounts")

    RecRemovalCounts.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("pcr", "0007_recremovalcounts_and_more"),
    ]

    operations = [
        migrations.RunPython(populate_table, reverse_table),
    ]
