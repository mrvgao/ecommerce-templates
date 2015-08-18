#!/usr/bin/env python
# encoding: utf-8

from django.conf.urls import patterns, url
from designer.views import up_works,views

urlpatterns = patterns('',
    url(r'^$', up_works.index, name='login'),
	url(r'^works_save$',up_works.works_save,name = 'works_save'),
	#未处理页面，点击处理并提交 的处理表单；同时也是 未通过，点击重生申请发布的 处理表单
	url(r'^edit_submit$',up_works.edit_submit,name = 'edit_submit'),
	#设计师作品管理，显示 未处理 页面
	url(r'^workd_unexecute$',up_works.workd_unexecute,name = 'workd_unexecute'),
	#未处理页面的删除cao zuo
	url(r'^unexecute_delete$',up_works.unexecute_delete,name = 'unexecute_delete'),
	#未通过 页面，点击重新申请发布
	url(r'^photo_not_passed$',up_works.photo_not_passed,name = 'photo_not_passed'),
	#审核中,显示未审核的页面
	url(r'^auditing$',up_works.auditing,name = 'auditing'),
	#显示已发布页面
	url(r'^has_published$',up_works.has_published,name = 'has_published'),
	#在已发布页面点击编辑后，传的值
	url(r'^published_edit$',up_works.published_edit,name = 'published_edit'),
	#在已发布页面点击编辑后，修改后提交的值
	url(r'^published_submit$',up_works.published_submit,name = 'published_submit'),
	#在已发布页面点击编辑后，点击删除
	url(r'^published_delete$',up_works.published_delete,name = 'published_delete'),
	#设计师个人中心，设计师本人看到的
	url(r'^design_list$',views.design_list,name = 'design_list'),
	##作品管理的 已发布7和设计师个人主页 都是用的这个部分方法实现 按照下载次数排序 downed_list
	url(r'^downed_list$',views.downed_list,name = 'downed_list'),
	#按照被收藏的个数排序 collect_list
	url(r'^collect_list$',views.collect_list,name = 'collect_list'),
	#最新上传的作品排序 new_list
	url(r'^new_list$',views.new_list,name = 'new_list'),
	#搜索方法
	url(r'^unpublished_good_search$',views.unpublished_good_search,name = 'unpublished_good_search'),
	#搜索已发布商品的方法  published_good_search
	url(r'^published_good_search$',views.published_good_search,name = 'published_good_search'),
	#显示我的动态的页面 my_state
	url(r'^my_state$',views.my_state,name = 'my_state'),
	#download_work
	#url(r'^download_work$',views.download_work,name = 'download_work'),
	#design_week_visit
	url(r'^design_week_visit$',views.design_week_visit,name = 'design_week_visit'),
	#design_month_visit
	url(r'^design_month_visit$',views.design_month_visit,name = 'design_month_visit'),
	#good_week_visit
	url(r'^good_week_visit$',views.good_week_visit,name = 'good_week_visit'),
	#good_month_visit
	url(r'^good_month_visit$',views.good_month_visit,name = 'good_month_visit'),
	#unpublish_eardrop_list
	url(r'^unpublish_eardrop_list$',views.unpublish_eardrop_list,name = 'unpublish_eardrop_list'),
	#publish_eardrop_list
	url(r'^publish_eardrop_list$',views.publish_eardrop_list,name = 'publish_eardrop_list'),
)
