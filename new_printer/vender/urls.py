# coding=utf-8
from django.conf.urls import patterns, url
from vender import views

urlpatterns = patterns('',
        # test
        url('test', views.test, name="test"),
        # 商家个人中心
        url('vender-center', views.vender_center, name="vender_center"),
)
