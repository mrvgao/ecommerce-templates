# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0004_vender_goods_is_cart'),
    ]

    operations = [
        migrations.AddField(
            model_name='vender_goods',
            name='cart_time',
            field=models.DateTimeField(null=True, blank=True),
        ),
    ]
