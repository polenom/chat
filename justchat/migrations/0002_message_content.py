# Generated by Django 4.1 on 2022-09-05 10:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('justchat', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='content',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]