# Django custom migrations to add locations to a sample
# is responsible for the creation of locations in the database.

from django.db import migrations

def populate_locations(apps, schema_editor):
    Location = apps.get_model('bak', 'Location')
    Location.objects.create(
        name='Kuehlhaus 1. OG.',
    )
    Location.objects.create(
        name='Kuehlhaus 3. OGß.',
    )

def reverse_populate_locations(apps, schema_editor):
    Location = apps.get_model('bak', 'Location')
    Location.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('bak', '0004_add_types'),
    ]

    operations = [
        migrations.RunPython(populate_locations, reverse_populate_locations),
    ]
