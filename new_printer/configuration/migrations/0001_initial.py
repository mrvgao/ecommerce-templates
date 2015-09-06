# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BetaApply',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('phone', models.CharField(max_length=15)),
                ('InvitationCode', models.CharField(max_length=15)),
                ('identity', models.CharField(max_length=15)),
                ('apply_time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Bills',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('bill', models.CharField(max_length=30)),
                ('subject', models.CharField(max_length=500)),
                ('bill_body', models.CharField(max_length=2000)),
                ('total_fee', models.FloatField(default=0.0)),
                ('trade_status', models.CharField(default=b'INIT', max_length=50, null=True)),
                ('bill_status', models.CharField(max_length=4)),
                ('where', models.CharField(default=None, max_length=10)),
                ('bill_time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Design_record',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('d_visit_time', models.DateTimeField(auto_now_add=True)),
                ('day_visits', models.IntegerField(default=0)),
                ('week_visits', models.IntegerField(default=0)),
                ('month_visits', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Designer_User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('phone', models.CharField(max_length=15)),
                ('designername', models.CharField(default=None, max_length=30, blank=True)),
                ('img', models.ImageField(upload_to=b'', blank=True)),
                ('marked_count', models.IntegerField(default=0, blank=True)),
                ('alipay', models.CharField(max_length=50)),
                ('alipay_name', models.CharField(default=None, max_length=200, null=True)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
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
            ],
        ),
        migrations.CreateModel(
            name='Goods',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('goods_name', models.CharField(max_length=50)),
                ('goods_price', models.FloatField(default=0.0)),
                ('description', models.TextField()),
                ('collected_count', models.IntegerField(default=0, blank=True)),
                ('download_count', models.IntegerField(default=0, blank=True)),
                ('tags', models.CharField(max_length=255)),
                ('style', models.CharField(default=b'', max_length=255, blank=True)),
                ('stl_path', models.FileField(upload_to=b'', blank=True)),
                ('preview_1', models.CharField(default=b'', max_length=255, blank=True)),
                ('preview_2', models.CharField(default=b'', max_length=255, blank=True)),
                ('preview_3', models.CharField(default=b'', max_length=255, blank=True)),
                ('zip_path', models.FileField(upload_to=b'', blank=True)),
                ('jcad_path', models.FileField(upload_to=b'', blank=True)),
                ('approval_time', models.DateTimeField(auto_now_add=True)),
                ('file_size', models.CharField(default=0, max_length=6, blank=True)),
                ('is_active', models.IntegerField(default=1)),
                ('file_type', models.CharField(default=b'stl', max_length=25, blank=True)),
                ('designer', models.ForeignKey(to='configuration.Designer_User')),
            ],
        ),
        migrations.CreateModel(
            name='Goods_Bills',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('bills_time', models.DateTimeField(auto_now_add=True)),
                ('bills', models.ForeignKey(to='configuration.Bills')),
                ('goods', models.ForeignKey(to='configuration.Goods')),
            ],
        ),
        migrations.CreateModel(
            name='Goods_Upload',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('goods_name', models.CharField(max_length=50)),
                ('goods_price', models.FloatField(default=0.0)),
                ('description', models.TextField()),
                ('tags', models.CharField(max_length=255)),
                ('style', models.CharField(default=b'', max_length=255, blank=True)),
                ('stl_path', models.CharField(max_length=255)),
                ('preview_1', models.CharField(max_length=255)),
                ('preview_2', models.CharField(max_length=255)),
                ('preview_3', models.CharField(max_length=255)),
                ('zip_path', models.FileField(upload_to=b'', blank=True)),
                ('jcad_path', models.FileField(upload_to=b'', blank=True)),
                ('upload_time', models.DateTimeField(auto_now_add=True)),
                ('modify_time', models.DateTimeField(auto_now_add=True, null=True)),
                ('file_size', models.CharField(default=0, max_length=5, blank=True)),
                ('good_state', models.IntegerField(default=0)),
                ('not_passed', models.CharField(max_length=255, null=True)),
                ('restdate', models.DateTimeField(auto_now_add=True, null=True)),
                ('type', models.CharField(default=b'stl', max_length=25, blank=True)),
                ('designer', models.ForeignKey(to='configuration.Designer_User')),
            ],
        ),
        migrations.CreateModel(
            name='Vender_Designer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('marked_date', models.DateTimeField(auto_now_add=True)),
                ('designer', models.ForeignKey(to='configuration.Designer_User')),
            ],
        ),
        migrations.CreateModel(
            name='Vender_Goods',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_collected', models.BooleanField(default=False)),
                ('collected_time', models.DateTimeField(null=True, blank=True)),
                ('is_download', models.BooleanField(default=False)),
                ('download_time', models.DateTimeField(null=True, blank=True)),
                ('is_cart', models.BooleanField(default=False)),
                ('cart_time', models.DateTimeField(null=True, blank=True)),
                ('is_buy', models.BooleanField(default=False)),
                ('buy_time', models.DateTimeField(null=True, blank=True)),
                ('goods', models.ForeignKey(to='configuration.Goods')),
            ],
        ),
        migrations.CreateModel(
            name='Vender_User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('phone', models.CharField(max_length=15)),
                ('vendername', models.CharField(default=None, max_length=30, blank=True)),
                ('img', models.CharField(default=b'', max_length=255, blank=True)),
                ('designer', models.ManyToManyField(to='configuration.Designer_User', through='configuration.Vender_Designer', blank=True)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='vender_goods',
            name='vender',
            field=models.ForeignKey(to='configuration.Vender_User'),
        ),
        migrations.AddField(
            model_name='vender_designer',
            name='vender',
            field=models.ForeignKey(to='configuration.Vender_User'),
        ),
        migrations.AddField(
            model_name='goods',
            name='vender',
            field=models.ManyToManyField(to='configuration.Vender_User', through='configuration.Vender_Goods', blank=True),
        ),
        migrations.AddField(
            model_name='good_record',
            name='good',
            field=models.ForeignKey(to='configuration.Goods'),
        ),
        migrations.AddField(
            model_name='design_record',
            name='designer',
            field=models.ForeignKey(to='configuration.Designer_User'),
        ),
        migrations.AddField(
            model_name='bills',
            name='goods',
            field=models.ManyToManyField(to='configuration.Goods', through='configuration.Goods_Bills', blank=True),
        ),
        migrations.AddField(
            model_name='bills',
            name='vender',
            field=models.ForeignKey(to='configuration.Vender_User'),
        ),
    ]
