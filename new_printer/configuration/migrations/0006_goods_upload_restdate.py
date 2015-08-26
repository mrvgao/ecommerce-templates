# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0005_vender_goods_cart_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='goods_upload',
            name='restdate',
            field=models.IntegerField(default=0),
        ),
    ]
