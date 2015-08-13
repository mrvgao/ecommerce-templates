# -*- coding:UTF-8 -*-

from django.conf.urls import patterns, url
from payment import views

urlpatterns = patterns('',
    url(r'^build_bills$', views.build_bills, name='build_bills'), 
    url(r'^list_bills$', views.list_bills, name='list_bills'),
)
