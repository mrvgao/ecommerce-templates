#!/usr/bin/env python
# encoding: utf-8

from django.conf.urls import patterns, url
from adminer import views

urlpatterns = patterns('',
    url(r'^word_list$', views.not_executed, name='index'),
    url(r'^pass_failed$',views.pass_failed,name = 'pass_failed'),
	url(r'^work_passing$',views.work_passing,name = 'work_passing'),
	#url(r'^photo_save$',views.photo_save,name = 'photo_save'),
	#url(r'^photo_more$',views.photo_more,name = 'photo_more'),
	#url(r'^show_zoom$',views.show_zoom,name = 'show_zoom'),
	
)
