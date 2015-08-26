#!/usr/bin/env python
# encoding: utf-8
# *-* coding: utf-8 -*-
'''
* data: 2015-8-10 8:17
  use: designer's personal
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
from configuration.models import Goods_Upload,Designer_User,Vender_Goods,Goods
from django.contrib.auth.models import User
import httplib, urllib
import urllib2,os
from datetime import date ,datetime
import time
import json,pdb#,jieba

def unexecuteed_search(describe,id,good_state):
	print describe,id,good_state
	goods = Goods_Upload.objects.filter(designer_id = id,good_state = good_state)
	#pdb.set_trace()
	finds_id = []
	s = list(jieba.cut(describe, cut_all = True))
	for i in s:
		describe_finds = goods.filter(description__icontains = i)
		name_finds = goods.filter(goods_name__icontains = i)
		for g in describe_finds:
			if g.id in finds_id:
				continue
		else:
			finds_id.append(g.id)
		for g in name_finds:
			if g.id in finds_id:
				continue
		else:
			finds_id.append(g.id)

	'''for find in finds_id:
		try:
			good = goods.filter(id = find)
		except Exception as e:
			print e
		if good: '''
		#find_goods.append(goods.filter(id = find))
	'''else:
			continue'''
	return finds_id

def published_search(describe,id):
	#pdb.set_trace()
	goods = Goods.objects.filter(designer_id = id)
	describe_finds = goods.filter(description__icontains = describe)
	name_finds = goods.filter(goods_name__icontains = describe)
	finds_id = []
	find_goods = []
	for find in describe_finds:
		finds_id.append(find.id)
	for find in name_finds:
		if find.id in finds_id:
			continue
		else:
			finds_id.append(find.id)

	for id in finds_id:
		try:
			good = goods.get(id = id)
		except Exception as e:
			print e
		if good: 
			find_goods.append(goods.get(id = id))
		else:
			continue

	return finds_id

def adminer_search(describe,good_state):
	goods = Goods_Upload.objects.filter(good_state = good_state)
	describe_finds = goods.filter(description__icontains = describe)
	name_finds = goods.filter(goods_name__icontains = describe)
	id_finds = goods.filter(id__icontains = describe)
	finds_id = []
	find_goods = []
	for find in describe_finds:
		finds_id.append(find.id)
	for find in name_finds:
		if find.id in finds_id:
			continue
		else:
			finds_id.append(find)
	for find in id_finds:
		if find.id in finds_id:
			continue
		else:
			finds_id.append(find)

	for id in finds_id:
		try:
			good = goods.get(id = id)
		except Exception as e:
			print e
		if good: 
			find_goods.append(goods.get(id = id))
		else:
			continue

	return finds_id
