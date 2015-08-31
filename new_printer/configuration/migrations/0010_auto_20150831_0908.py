# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0009_testuser_last_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='testuser',
            name='user',
        ),
        migrations.DeleteModel(
            name='TestUser',
        ),
    ]
