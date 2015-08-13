#!/usr/bin/env python
# encoding: utf-8

from django.conf.urls import patterns, url
from designer.views import up_works,views

urlpatterns = patterns('',
    url(r'^$', up_works.index, name='login'),
    #url(r'^logout$', account_handler.user_logout, name='logout'),
    #url(r'^filter_photo$',views.filter_photo,name = 'filter_photo'),
	#url(r'^photo_list$',views.photo_list,name = 'photo_list'),
	#url(r'^photo_save$',views.photo_save,name = 'photo_save'),
	#url(r'^photo_more$',views.photo_more,name = 'photo_more'),
	#url(r'^show_zoom$',views.show_zoom,name = 'show_zoom'),
	url(r'^works_save$',up_works.works_save,name = 'works_save'),

	url(r'^edit_submit$',up_works.edit_submit,name = 'edit_submit'),

	url(r'^workd_execute$',up_works.workd_execute,name = 'workd_execute'),

	url(r'^delete$',up_works.delete,name = 'delete'),

	url(r'^photo_edit$',up_works.photo_edit,name = 'edit'),

	url(r'^photo_not_passed$',up_works.photo_not_passed,name = 'photo_not_passed'),
	#url(r'^re_edit_submit$',up_works.re_edit_submit,name = 're_edit_submit'),
	url(r'^auditing$',up_works.auditing,name = 'auditing'),
	url(r'^edit$',up_works.edit_submit,name = 'edit'),
	
)
