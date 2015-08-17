# -*- coding:UTF-8 -*-

from django.conf.urls import patterns, url
from payment import views

urlpatterns = patterns('',
    url(r'^build_bills$', views.build_bills, name='build_bills'), 
    url(r'^list_bills$', views.list_bills, name='list_bills'),
    url(r'^add_cart$', views.add_cart, name='add_cart'),
    url(r'^list_cart$', views.list_cart, name='list_cart'),
    url(r'^del_cart', views.del_cart, name='del_cart'),
    url(r'^pay', views.pay, name='pay'),
)
