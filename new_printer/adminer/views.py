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
from designer.conf import website 
from configuration.models import Goods_Upload,Goods
from django.contrib.auth.models import User
import httplib, urllib
import urllib2,os
from datetime import date ,datetime
import time
import json,pdb

#显示默认页面，未处理商品
def not_executed(request):
	not_executed_works = Goods_Upload.objects.filter(good_state = 1)
	conf = {
			'works_auditing':not_executed
			}
	return render(request,website.works_auditing)

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
	fail_state = [0,1]#request.POST['state']
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
	id = 150#request.POST['id']
	pass_state = [1]#request.POST['state']
	style = ''
	count = 1
	tags = u'项链'
	print type(tags)
	for state in pass_state:
		if count == len(pass_state):
			style = style + str(website.good_style[state]) 
		else :
			style = style + str(website.good_style[state]) + ','
		count = count +1
		
	print style
	#pdb.set_trace()
	photo = Goods_Upload.objects.filter(id = id).update(
						good_state = 3
						#modify_time = datetime.now()
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

#def search(request):
