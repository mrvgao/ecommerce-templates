# -*- coding: UTF-8 -*-

from django.conf.urls import patterns, url
from account import views

urlpatterns = patterns('',
    url(r'^check_phone$', views.check_phone, name='check_phone'),
    url(r'^send_verify_message$', views.send_verify_message, name='send_verify_message'),
    url(r'^beta_apply$', views.beta_apply, name='beta_apply'),
    url(r'^check_code$', views.check_code, name='check_code'),
    url(r'^u_register$', views.u_register, name='u_register'),
    url(r'^u_login$', views.u_login, name='u_login'),
)
