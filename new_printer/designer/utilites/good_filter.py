#!/usr/bin/env python
# encoding: utf-8
# *-* coding: utf-8 -*-
'''
* data: 2015-8-10 8:17
  use: designer's personal
'''
from django.contrib.auth.decorators import login_required
from django.contrib.auth import *
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from designer.conf import website
import json, os, uuid, base64, platform, requests
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext
from django import forms
from django.contrib.auth.models import User
from configuration.models import Goods_Upload,Designer_User,Vender_Goods,Goods
import httplib, urllib
import urllib2,os
from datetime import date ,datetime,timedelta
import time
import json,pdb

def unpublish_good_filter(good_state,tags,designer):
	good_list = Goods_Upload.objects.filter(designer_id=designer,tags = tags,good_state=good_state)
	return_list = []
	for good in good_list:
		temp={ 'id':good.id,
                'name':good.goods_name,
                'description':good.description,
                'good_price':good.goods_price,
                'preview_1':str(website.file_server_path)+str(good.preview_1),
                'preview_2':str(website.file_server_path)+str(good.preview_2),
                'preview_3':str(website.file_server_path)+str(good.preview_3),
                'file_size':good.file_size,
                'not_passed':good.not_passed,
                'stl_path':good.stl_path,
                'style':good.style,
                'tags':good.tags,
                'upload_time':good.upload_time.strftime("%Y-%m-%d"),
                'modify_time':good.modify_time.strftime("%Y-%m-%d"),
                'good_state':good.good_state
                }
    	return_list.append(temp)
	return return_list

def publish_good_filter(tags,designer):
	good_list = Goods.objects.filter(designer_id=designer,tags = tags)
	return_list = []
	for good in good_list:
		temp = {'id':good.id,
                'name':good.goods_name,
                'description':good.description,
                'collected_count':good.collected_count,
                'download_count':good.download_count,
                'good_price':good.goods_price,
                'preview_1':str(website.file_server_path)+str(good.preview_1),
                'preview_2':str(website.file_server_path)+str(good.preview_2),
                'preview_3':str(website.file_server_path)+str(good.preview_3),
                #'stl_file_url':str(website.toy_server_imgupload)+str(photo.stl_file_url),
                'file_size':good.file_size,
                'style':good.style,
                'stl_path':str(good.stl_path),
                'approval_time':good.approval_time.strftime("%Y-%m-%d"),
          		'tags':good.tags
                }
        return_list.append(temp)
	return return_list

def unpublish_exec(good_list):
	return_list = []
	for good in good_list:
		temp={ 'id':good.id,
                'name':good.goods_name,
                'description':good.description,
                'good_price':good.goods_price,
                'preview_1':str(website.file_server_path)+str(good.preview_1),
                'preview_2':str(website.file_server_path)+str(good.preview_2),
                'preview_3':str(website.file_server_path)+str(good.preview_3),
                'file_size':good.file_size,
                'not_passed':good.not_passed,
                'stl_path':good.stl_path,
                'style':good.style,
                'tags':good.tags,
                'upload_time':good.upload_time.strftime("%Y-%m-%d"),
                'modify_time':good.modify_time.strftime("%Y-%m-%d"),
                'good_state':good.good_state
                }
		return_list.append(temp)
	return return_list

def publish_exec(good_list):
	return_list = []
	#pdb.set_trace()
	print len(good_list)
	for good in good_list:
		temp = {'id':good.id,
                'name':good.goods_name,
                'description':good.description,
                'collected_count':good.collected_count,
                'download_count':good.download_count,
                'good_price':good.goods_price,
                'preview_1':str(website.file_server_path)+str(good.preview_1),
                'preview_2':str(website.file_server_path)+str(good.preview_2),
                'preview_3':str(website.file_server_path)+str(good.preview_3),
                #'stl_file_url':str(website.toy_server_imgupload)+str(photo.stl_file_url),
                'file_size':good.file_size,
                'style':good.style,
                'stl_path':str(good.stl_path),
                'approval_time':good.approval_time.strftime("%Y-%m-%d"),
          		'tags':good.tags
                }
		print good.id
		return_list.append(temp)
        
	return return_list