#coding:utf-8
from django.conf.urls import patterns, url
from shop import views

urlpatterns = patterns('',
        # 首页
        url('^$', views.list, name="index"),

        # 商品详情页
        url('goods_detail', views.goods_detail, name="goods_detail"),

        # 首页按类型筛选，ajax
        url('filter-type', views.filter_type, name="filter_type"),
)

