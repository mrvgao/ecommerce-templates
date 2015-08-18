# -*- coding: UTF-8 -*-

from django.conf.urls import patterns, url
from account import views

urlpatterns = patterns('',
    url(r'^u_forgetpwd', views.u_forgetpwd, name='u_forgetpwd'),
    url(r'^u_resetpwd', views.u_resetpwd, name='u_resetpwd'),
    url(r'^u_logout', views.u_logout, name='u_logout'),
    url(r'^u_change_phone', views.u_change_phone, name='u_change_phone'),
    url(r'^u_change_username', views.u_change_username, name='u_change_username'),
    url(r'^u_alipay', views.u_alipay, name='u_alipay'),

)
