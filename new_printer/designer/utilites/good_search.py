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
from configuration.models import Goods_Upload,Designer_User,Vender_Goods
from django.contrib.auth.models import User
import httplib, urllib
import urllib2,os
from datetime import date ,datetime
import time
import json,pdb

def unexecuteed_search(describe,id,good_state):
    pdb.set_trace()
	
	goods = Goods_Upload.objects.filter(designer_id = id,good_state = good_state)
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
	return find_goods

def published_search(describe,id):
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

	return find_goods
