#coding:utf-8
from django.conf.urls import patterns, url
from shop import views

urlpatterns = patterns('',
        # 首页
        url('^$', views.index, name="index"),

        # 商品详情页
        url('goods_detail', views.goods_detail, name="goods_detail"),
)

