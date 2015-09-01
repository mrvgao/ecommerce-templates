# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0013_goods_upload_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goods_upload',
            name='restdate',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
