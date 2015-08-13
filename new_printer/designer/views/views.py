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
from configuration.models import Goods_Upload
import httplib, urllib
import urllib2,os
from datetime import date ,datetime
import time
import json,pdb


def download_work(request):
    ids = request.POST['id']
    for id in ids:
        this_work = Goods_Upload.objects.get(id=id)
        name = this_work.name
        stl_md5 = this_work.stl_path
    #pdb.set_trace()
        boundary = '----------%s' % hex(int(time.time() * 1000))
        data = []
        data.append('--%s' % boundary)
        data.append('Content-Disposition: form-data; name="%s"\r\n' % 'stl_md5')
        data.append(stl_md5)
        data.append('--%s' % boundary)
        data.append('Content-Disposition: form-data; name="%s"; filename="%s"' % ('profile',str(name)))
        data.append('Content-Type: %s\r\n' % 'image/png')
        data.append(chunks)
        data.append('--%s--\r\n' % boundary)
        http_url = website.toy_server_upload#'http://192.168.1.104:8888/file/upload'
        http_body = '\r\n'.join(data)
        req = urllib2.Request(http_url, data=http_body)
        req.add_header('Content-Type', 'multipart/form-data; boundary=%s' % boundary)
        req.add_header('User-Agent','Mozilla/5.0')
        req.add_header('Referer','%s'%website.toy_server_ip)#'http://192.168.1.104:8888/')
        resp = urllib2.urlopen(req, timeout=2545)
        qrcont=resp.read()
        md = json.loads(qrcont)
        md5 = md[name]
        
@login_required
def design_list(request):
    '''
	个人中心首页，按时间列出全部作品
    '''
    user = request.user
    designer = Designer.objects.get(user_id=user.id)
    designer.icon = str(adminer_website.icon_server_path) + designer.icon
    design_list = Goods.objects.filter(customer_id=customer.id)
    collect_num = 0
    all_list = []
    for design in design_list:
    	if design.collect > 1:
            collect_num = collect_num + 1
    conf = {'all_list':all_list,
    			'collect_num':collect_num
    		  }
    return render(request, website.all_list, conf)

def downed_list(request):
    '''
    展示按照下载次数排序结果
    '''
    user = request.user
    designer = Designer.objects.get(user_id=user.id)
    design_list = Goods.objects.filter(customer_id=customer.id).order_by(downed)
    conf = {'all_list':all_list
    		  }
    return HttpResponse(json.dumps(conf))

def collect_list(request):
    '''
    按照被收藏的个数排序
    '''



def new_list(request):
    '''
    最新上传的作品排序
    '''



def ring_list(request):
    '''
    点击戒指，列出戒指的所以设计作品
    '''



def pendant_list(request):
    '''
    点击吊坠，列出吊坠的所以设计作品
    '''



#def eardrop_list(request):



#def barcedt_list(request):



#def necklace_list(request):



def show_more(request):
    count = int(request.POST['count'])
    photo_lists = Toy_photo.objects.filter(is_active=True)
    print "count",count
    length = len(photo_lists)
    #status = True
    print "length:",length
    if (length-count*show_num)>0:
        photo_lists = photo_lists[((count)*show_num):((count+1)*show_num)]
    elif (length-count*show_num)<show_num:
        photo_lists = photo_lists[(count*show_num):]
    else:
        photo_lists = []
    #    status = False
    print "photo_lists:",len(photo_lists)
    return_list = []
    for photo in photo_lists:
        temp = {'id':photo.id,
                'name':photo.name,
                'describe':photo.describe,
                'preview_1':str(adminer_website.toy_server_path)+str(photo.preview_1),
                'marked_count':photo.marked_count,
                'thumbnail_1':str(adminer_website.toy_server_path)+str(photo.thumbnail_1),
                'stl_file_url':str(adminer_website.toy_server_path)+str(photo.stl_file_url)
                }
        return_list.append(temp)
    context = {
        'photo_list':return_list,
        'length':length

    }
    return HttpResponse(json.dumps(context))


def show_detail(request):
	pass

