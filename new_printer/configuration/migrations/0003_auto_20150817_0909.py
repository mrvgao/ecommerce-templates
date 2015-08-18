# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0002_auto_20150814_0214'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goods',
            name='preview_1',
            field=models.CharField(default=b'', max_length=255, blank=True),
        ),
        migrations.AlterField(
            model_name='goods',
            name='preview_2',
            field=models.CharField(default=b'', max_length=255, blank=True),
        ),
        migrations.AlterField(
            model_name='goods',
            name='preview_3',
            field=models.CharField(default=b'', max_length=255, blank=True),
        ),
        migrations.AlterField(
            model_name='vender_user',
            name='img',
            field=models.CharField(default=b'', max_length=255, blank=True),
        ),
    ]
