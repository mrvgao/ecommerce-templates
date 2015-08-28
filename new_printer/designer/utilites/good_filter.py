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
from configuration import website as server_website
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
from django.utils import timezone

unexec_one = 2 #
auditing_one = 2#
unpassed_one = 2#
publish_one = 2#
pwd = '/Users/laola/Desktop/static'

def unpublish_good_filter(good_state,tags,designer):
	good_list = Goods_Upload.objects.filter(designer_id=designer,tags = tags,good_state=good_state)
	return_list = []
	for good in good_list:
		temp={ 'id':good.id,
                'name':good.goods_name,
                'description':good.description,
                'good_price':good.goods_price,
                'preview_1':str(server_website.file_server_path)+str(good.preview_1),
                'preview_2':str(server_website.file_server_path)+str(good.preview_2),
                'preview_3':str(server_website.file_server_path)+str(good.preview_3),
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
                'preview_1':str(server_website.file_server_path)+str(good.preview_1),
                'preview_2':str(server_website.file_server_path)+str(good.preview_2),
                'preview_3':str(server_website.file_server_path)+str(good.preview_3),
                #'stl_file_url':str(server_website.toy_server_imgupload)+str(photo.stl_file_url),
                'file_size':good.file_size,
                'style':good.style,
                'stl_path':str(good.stl_path),
                'approval_time':good.approval_time.strftime("%Y-%m-%d"),
          		'tags':good.tags
                }
        return_list.append(temp)
	return return_list




#对 未发布 商品的处理
def unpublish_exec(good_list):
    return_list = []
    now = timezone.now()
    for good in good_list:
        photo = []
        temp = {}
        if good.preview_1:
            photo.append(str(server_website.file_server_path)+str(good.preview_1))
        if good.preview_2:
            photo.append(str(server_website.file_server_path)+str(good.preview_2))
        if good.preview_3:
            photo.append(str(server_website.file_server_path)+str(good.preview_3))
        #temp{'pic']=photo
        modify = good.modify_time
        temp={'id':good.id,
                'name':good.goods_name,
                'description':good.description,
                'good_price':good.goods_price,
                #'preview_1':str(server_website.file_server_path)+str(good.preview_1),
                #'preview_2':str(server_website.file_server_path)+str(good.preview_2),
                #'preview_3':str(server_website.file_server_path)+str(good.preview_3),
                'file_size':good.file_size,
                'not_passed':good.not_passed,
                'stl_path':str(server_website.file_server_path)+good.stl_path,
                'style':good.style,
                'tags':good.tags,
                'upload_time':good.upload_time.strftime("%Y-%m-%d"),
                'modify_time':good.modify_time.strftime("%Y-%m-%d"),
                'good_state':good.good_state,
                'type':'stl',
                'pic':photo,
                'restdate':(now-modify).days
                }
        return_list.append(temp)
    return return_list

def publish_exec(good_list):
    return_list = []
    #pdb.set_trace()
    print len(good_list)
    for good in good_list:
        photo = []
        temp = {}
        if good.preview_1:
            photo.append(str(server_website.file_server_path)+str(good.preview_1))
        if good.preview_2:
            photo.append(str(server_website.file_server_path)+str(good.preview_2))
        if good.preview_3:
            photo.append(str(server_website.file_server_path)+str(good.preview_3))
        temp = {'id':good.id,
                'name':good.goods_name,
                'description':good.description,
                'collected_count':good.collected_count,
                'download_count':good.download_count,
                'good_price':good.goods_price,
                #'preview_1':str(server_website.file_server_path)+str(good.preview_1),
                #'preview_2':str(server_website.file_server_path)+str(good.preview_2),
                #'preview_3':str(server_website.file_server_path)+str(good.preview_3),
                #'stl_file_url':str(server_website.toy_server_imgupload)+str(photo.stl_file_url),
                'file_size':good.file_size,
                'style':good.style,
                'stl_path':str(good.stl_path),
                'approval_time':good.approval_time.strftime("%Y-%m-%d"),
                'tags':good.tags,
                'pic':photo
                }
        print good.id
        return_list.append(temp)

    return return_list
#下载STL 文件到本地,以便预览stl
def down_stl(_url):
    stl_path = "%s/temp/"%pwd
    #_url = request.POST['url']
    #pdb.set_trace()
    #_url = 'http://192.168.1.101:8888/5d9d45315d5f24f97f138450459edfdf/ahri_九尾妖狐.stl'
    local_filename = _url.split('/')[-1]
    r = requests.get(_url, stream=True)
    lists = os.listdir(stl_path)
    aleady_h = _url.split('/')[-1]
    stl_path = stl_path + local_filename
    if aleady_h in lists :
        stl_path = stl_path.split('/')[-3:]
        stl_path = "/".join(stl_path)
        stl_path = '/' + stl_path
        print stl_path
        context = {'stl_path':stl_path}
    else:
        print stl_path
        with open(stl_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:  # filter out keep-alive new chunks
                    f.write(chunk)
                    f.flush()
        stl_path = stl_path.split('/')
        stl_path = stl_path[-3:]
        stl_path = "/".join(stl_path)
        stl_path = '/' + stl_path
        print stl_path
        context = {'stl_path':stl_path}

    return stl_path

#首页
def to_first(good_state,designer):
    if good_state > 3:
        good_list = Goods.objects.filter(designer_id=designer)
        return_list = publish_exec(good_list)
        return_list = return_list[:publish_one]
    else:
        good_list = Goods_Upload.objects.filter(designer_id=designer,good_state=good_state)
        return_list = unpublish_exec(good_list)
        return_list = return_list[:unexec_one]
    return return_list

#未页
def to_last(good_state,designer):
    if good_state > 3:
        good_list = Goods.objects.filter(designer_id=designer)
        len_good = len(good_list)
        last = len_good/publish_one
        return_list = publish_exec(good_list)
        return_list = return_list[last:]
    else:
        good_list = Goods_Upload.objects.filter(designer_id=designer,good_state=good_state)
        len_good = len(good_list)
        last = len_good/unexec_one
        return_list = unpublish_exec(good_list)
        return_list = return_list[last:]
    return return_list

#下一页
def next_page(good_state,designer,now_page):
    if good_state > 3:
        good_list = Goods.objects.filter(designer_id=designer)
        len_good = len(good_list)
        last = len_good/publish_one
        return_list = good_list[(now_page*publish_one):(now_page+1)*publish_one]
        return_list = publish_exec(return_list)
    else:
        good_list = Goods_Upload.objects.filter(designer_id=designer,good_state=good_state)
        len_good = len(good_list)
        last = len_good/unexec_one
        return_list = good_list[(now_page*publish_one):(now_page+1)*publish_one]
        return_list = unpublish_exec(return_list)
    return return_list

#go to now_page
