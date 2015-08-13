#!/usr/bin/env python
# encoding: utf-8

from django.conf.urls import patterns, url
from toy_photo import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^login$', views.user_login, name='login'),
    #url(r'^login$', account_handler.user_login, name='login'),
    #url(r'^logout$', account_handler.user_logout, name='logout'),
    url(r'^filter_photo$',views.filter_photo,name = 'filter_photo'),
	url(r'^photo_list$',views.photo_list,name = 'photo_list'),
	url(r'^photo_save$',views.photo_save,name = 'photo_save'),
	url(r'^photo_more$',views.photo_more,name = 'photo_more'),
	url(r'^show_zoom$',views.show_zoom,name = 'show_zoom'),
	url(r'^logout$',views.user_logout,name = 'logout'),
	url(r'^log_index$',views.log_index,name = 'return_login'),
	#url(r'^add_new_photo$',views.add_new_photo,name = 'add_new_photo'),
	
)
