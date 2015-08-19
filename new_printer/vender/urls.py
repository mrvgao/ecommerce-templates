# coding=utf-8
from django.conf.urls import patterns, url
from vender import views

urlpatterns = patterns('',
        # test
        url('test', views.test, name="test"),

        # 商家个人中心
        url('vender-center', views.vender_center, name="vender_center"),
        # 商家后台首页(全部下载)

        url('^$', views.vender_center, name="vender_center"),

        # 商家后台我的收藏(设计师)
        url('^myCollection/designers$', views.designers_collection, name="designers_collection"),

        # 商家后台我的收藏(作品)
        url('^myCollection/works$', views.works_collection, name="works_collection"),

        # 商家后台账户设置
        url('^account/setup$', views.set_account, name="set_account"),

        # 商家后台退出
        url('^account/logout$', views.logout_account, name="logout_account"),




)
