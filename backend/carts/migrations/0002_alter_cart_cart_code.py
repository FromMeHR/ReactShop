# Generated by Django 5.1.6 on 2025-03-30 11:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('carts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='cart_code',
            field=models.TextField(blank=True, null=True, unique=True),
        ),
    ]
