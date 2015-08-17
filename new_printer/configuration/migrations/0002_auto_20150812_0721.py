# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='goods',
            name='file_size',
            field=models.CharField(default=0, max_length=6, blank=True),
        ),
        migrations.AddField(
            model_name='goods_upload',
            name='file_size',
            field=models.CharField(default=0, max_length=5, blank=True),
        ),
        migrations.AlterField(
            model_name='goods_upload',
            name='preview_1',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='goods_upload',
            name='preview_2',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='goods_upload',
            name='preview_3',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='goods_upload',
            name='stl_path',
            field=models.CharField(max_length=255),
        ),
    ]
