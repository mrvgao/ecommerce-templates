# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0002_goods_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='bills',
            name='where',
            field=models.CharField(default=None, max_length=10),
        ),
    ]
