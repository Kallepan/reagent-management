# Django custom migration to populate the database with initial data.
# is responsible for the creation of types in the database.

import csv
import os

from django.db import migrations

import logging

def populate_types(apps, schema_editor):
    """ Populates the tables with data """
    with open(os.path.join(os.path.dirname(__file__), '0004_types.csv'), 'r') as f:
        reader = csv.reader(f)
        
        Type = apps.get_model('bak', 'Type')
        for row in reader:
            Type.objects.create(
                name=row[0],
                producer=row[1],
                article_number=row[2]
            )
        
    logging.info("Types populated.")

def reverse_populate_types(apps, schema_editor):
    """ Empties the tables """
    Type = apps.get_model('bak', 'Type')

    Type.objects.all().delete()

    logging.info("Types emptied.")

class Migration(migrations.Migration):
    dependencies = [
        ('bak', '0003_type_article_number'),
    ]

    operations = [
        migrations.RunPython(populate_types, reverse_populate_types),
    ]
