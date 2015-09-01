# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0011_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='goods',
            name='file_type',
            field=models.CharField(default=b'stl', max_length=25, blank=True),
        ),
    ]
