#!/usr/bin/env python
# encoding: utf-8
# *-* coding: utf-8 -*-
'''
* data: 2015-8-10 8:17
  use: adminer's personal
'''
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.shortcuts import get_object_or_404
import json, os, uuid, base64, platform, requests
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext
from django import forms
from configuration import website 
from conf import website as adminer_website 
from configuration.models import Goods_Upload,Goods
from django.contrib.auth.models import User
import httplib, urllib
import urllib2,os
from datetime import date ,datetime
import time
import json,pdb

#显示默认页面，未处理商品
def word_list(request):
	print 'a'
	not_executed_works = Goods_Upload.objects.filter(good_state = 1)
	conf = {
			'works_auditing':not_executed_works
			}
	print 'ccc:'
	print not_executed_works
	print 'bbb'
	print conf['works_auditing']
	return HttpResponse(json.dumps(conf))
	#return render(request,website.works_auditing)

'''def works_pass(request):
	ids = request.POST['ids']
	for id in ids:
		photo = Goods_Upload.objects.get(id = id)
		new_pass = Goods.objects.create(
						goods_name = photo.goods_name,
						designer = photo.designer,
						goods_price = photo.goods_price,
						description = photo.description,
						tags = photo.tags,
						style = photo.style,
						stl_path = photo.stl_path,
						preview_1 = photo.preview_1,
						preview_2 = photo.preview_2,	
						preview_3 = photo.preview_3,
						file_size = photo.file_size
						)'''
#点击驳回按键后的处理
def pass_failed(request):
	id = 40#request.POST['id']
	#fail_state = [0,1]#request.POST['state']
	failed_reason = ''
	count = 1
	#pdb.set_trace()
	for state in fail_state:
		if count == len(fail_state):
			failed_reason = failed_reason + str(website.reason_failed[state]) 
		else :
			failed_reason = failed_reason + str(website.reason_failed[state]) + ','
		count = count +1
	print failed_reason
	else_reason = '难看'#request.POST['reason']
	if else_reason:
		failed_reason = failed_reason + ',' + str(else_reason)
	photo = Goods_Upload.objects.filter(id = id).update(
						good_state = 2,
						not_passed = failed_reason
						)
	conf = {'status':"success"}
	return HttpResponse(json.dumps(conf))


#显示已驳回的页面
def has_failed(request):
	has_failed_works = Goods_Upload.objects.filter(good_state = 2)
	conf = {
			'works_auditing':has_failed_works
			}
	return HttpResponse(json.dumps(conf))
#显示已通过的页面
def has_passed(request):
	has_passed_works = Goods_Upload.objects.filter(good_state = 3)
	conf = {
			'works_auditing':has_passed_works
			}
	return HttpResponse(json.dumps(conf))

#点击审核通过按键
def work_passing(request):
	id = 160#request.POST['id']
	style_state = 1 #request.POST['state']
	tags_state = 1 #request.POST['state']
	count = 1
	tags = website.good_tags[tags_state]
	style = website.good_style[style_state]
	photo = Goods_Upload.objects.filter(id = id).update(
						good_state = 3,
						modify_time = datetime.now()
						)
	photo = Goods_Upload.objects.get(id = id)

	new_pass = Goods.objects.create(
						goods_name = photo.goods_name,
						designer = photo.designer,
						goods_price = photo.goods_price,
						description = photo.description,
						tags = tags,
						style = style,
						stl_path = photo.stl_path,
						preview_1 = photo.preview_1,
						preview_2 = photo.preview_2,	
						preview_3 = photo.preview_3,
						file_size = photo.file_size
						#approval_time = datetime.now()
						)
	conf = {'status':"success"}
	return HttpResponse(json.dumps(conf))


# 后台管理页面：审核作品和客服聊天
def background(request):
	not_executed_works = Goods_Upload.objects.filter(good_state = 1)
	conf = {'all_list': not_executed_works, 'photo_server': website.file_server_path}
	return render(request,adminer_website.background,conf)	


#def search(request):
