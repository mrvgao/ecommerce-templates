# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0003_merge'),
    ]

    operations = [
        migrations.CreateModel(
            name='Design_record',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('d_visit_time', models.DateTimeField(auto_now_add=True)),
                ('day_visits', models.IntegerField(default=0)),
                ('week_visits', models.IntegerField(default=0)),
                ('month_visits', models.IntegerField(default=0)),
                ('designer', models.ForeignKey(to='configuration.Designer_User')),
            ],
        ),
        migrations.CreateModel(
            name='Good_record',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('g_visit_time', models.DateTimeField(auto_now_add=True)),
                ('day_visit', models.IntegerField(default=0)),
                ('week_visit', models.IntegerField(default=0)),
                ('month_visit', models.IntegerField(default=0)),
                ('good', models.ForeignKey(to='configuration.Vender_User')),
            ],
        ),
        migrations.AddField(
            model_name='goods_upload',
            name='good_state',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='goods_upload',
            name='modify_time',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='goods_upload',
            name='not_passed',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
