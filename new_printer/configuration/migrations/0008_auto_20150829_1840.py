# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0007_testuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='testuser',
            name='name',
            field=models.CharField(default=b'Minchiuan', max_length=20),
        ),
    ]
