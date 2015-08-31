# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0008_auto_20150829_1840'),
    ]

    operations = [
        migrations.AddField(
            model_name='testuser',
            name='last_name',
            field=models.CharField(default=b'Minchiuan', max_length=20),
        ),
    ]
