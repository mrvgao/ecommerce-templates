# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0003_bills_where'),
    ]

    operations = [
        migrations.AddField(
            model_name='vender_goods',
            name='is_cart',
            field=models.BooleanField(default=False),
        ),
    ]
