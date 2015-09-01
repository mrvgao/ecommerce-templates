# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0012_goods_file_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='goods_upload',
            name='type',
            field=models.CharField(default=b'stl', max_length=25, blank=True),
        ),
    ]
