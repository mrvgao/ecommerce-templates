# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0006_goods_upload_restdate'),
    ]

    operations = [
        migrations.AddField(
            model_name='designer_user',
            name='alipay_name',
            field=models.CharField(default=None, max_length=200),
        ),
    ]
