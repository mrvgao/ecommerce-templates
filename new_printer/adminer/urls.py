#!/usr/bin/env python
# encoding: utf-8

from django.conf.urls import patterns, url
from adminer import views

urlpatterns = patterns('',
    url(r'^$', up_works.index, name='login'),
    #url(r'^filter_photo$',views.filter_photo,name = 'filter_photo'),
	#url(r'^photo_list$',views.photo_list,name = 'photo_list'),
	#url(r'^photo_save$',views.photo_save,name = 'photo_save'),
	#url(r'^photo_more$',views.photo_more,name = 'photo_more'),
	#url(r'^show_zoom$',views.show_zoom,name = 'show_zoom'),
	
)
