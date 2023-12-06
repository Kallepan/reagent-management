from django.db import migrations
import logging

def populate_table(apps, schema_editor):
    """ Populates the tables with data """
    analyses = [ "CMV", "EBV", "HEV", "MTB", "CLOS", "HSV+VZV", "IC", "CPE500", "RB", "PNJI", "MTB", "MDR"]
    devices = ["InGe01", "InGe02" , "InGe03", "InGe04"]
    kinds = ["Mastermix", "Standard", "Kontrolle", "Interne Kontrolle"]

    logging.info("Tables populated.")

    Analysis = apps.get_model('pcr', 'Analysis')
    Device = apps.get_model('pcr', 'Device')
    Kind = apps.get_model('pcr', 'Kind')

    for analysis in analyses:
        Analysis.objects.create(name=analysis)
    
    for device in devices:
        Device.objects.create(name=device)
    
    for kind in kinds:
        Kind.objects.create(name=kind)

    logging.info("Tables populated.")

def empty_table(apps, schema_editor):
    """ Empties the tables """
    Analysis = apps.get_model('pcr', 'Analysis')
    Device = apps.get_model('pcr', 'Device')
    Kind = apps.get_model('pcr', 'Kind')

    Analysis.objects.all().delete()
    Device.objects.all().delete()
    Kind.objects.all().delete()

    logging.info("Tables emptied.")

class Migration(migrations.Migration):
    dependencies = [
        ('pcr', '0002_initial'),
    ]

    operations = [
        migrations.RunPython(populate_table, empty_table),
    ]