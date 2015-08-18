#coding:utf-8
from django.conf.urls import patterns, url
from vender import views

urlpatterns = patterns('',
        # 商家后台首页(全部下载)
        url('^$', views.index, name="vc_index"),

        # 商家后台我的收藏(设计师)
        url('^myCollection/designers$', views.collectionDesigners, name="vc_collectionDesigners"),

        # 商家后台我的收藏(作品)
        url('^myCollection/works$', views.collectionWorks, name="vc_collectionWorks"),

        # 商家后台账户设置
        url('^account/setup$', views.accountSetup, name="vc_accountSetup"),

        # 商家后台退出
        url('^account/logout$', views.accountLogout, name="vc_accountLogout"),

)
