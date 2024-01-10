from django.db import migrations

def create_schema(apps, schema_editor):
    # Create schema for department
    sql_code = """
        CREATE SCHEMA IF NOT EXISTS pcr;
    """

    with schema_editor.connection.cursor() as cursor:
        cursor.execute(sql_code)

def destroy_schema(apps, schema_editor):
    # Delete schema for department
    sql_code = """
        DROP SCHEMA IF EXISTS pcr CASCADE;
    """

    with schema_editor.connection.cursor() as cursor:
        cursor.execute(sql_code)

class Migration(migrations.Migration):
    initial = True

    dependencies = [
    ]

    operations = [
        migrations.RunPython(create_schema, destroy_schema),
    ]