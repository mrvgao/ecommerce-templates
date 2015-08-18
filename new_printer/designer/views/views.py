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
from designer.utilites import search_handle , good_filter
import json, os, uuid, base64, platform, requests
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext
from django import forms
from django.contrib.auth.models import User
from configuration.models import Goods_Upload,Designer_User,Vender_Goods,Goods,Vender_User
import httplib, urllib
import urllib2,os
from datetime import date ,datetime
import time
import json,pdb


def download_work(request):
    ids = [38]#request.POST['id']
    for id in ids:
        this_work = Goods_Upload.objects.get(id=id)
        name = this_work.goods_name + '.zip'
        stl_md5 = this_work.stl_path
        stl_md5 = stl_md5.split('.')
        stl_md5 = stl_md5[0]
    #pdb.set_trace()
        boundary = '----------%s' % hex(int(time.time() * 1000))
        data = []
        data.append('--%s' % boundary)
        data.append('Content-Disposition: form-data; name="%s"\r\n' % 'stl_md5')
        data.append(stl_md5)
        data.append('--%s' % boundary)
        data.append('Content-Disposition: form-data; name="%s"; filename="%s"' % ('profile',str(name)))
        data.append('Content-Type: %s\r\n' % 'image/png')
        #data.append(chunks)
        data.append('--%s--\r\n' % boundary)
        http_url = website.file_server_download#'http://192.168.1.116:8888/file/upload'
        http_body = '\r\n'.join(data)
        req = urllib2.Request(http_url, data=http_body)
        req.add_header('Content-Type', 'multipart/form-data; boundary=%s' % boundary)
        req.add_header('User-Agent','Mozilla/5.0')
        req.add_header('Referer','%s'%website.file_server_ip)#'http://192.168.1.116:8888/')
        resp = urllib2.urlopen(req, timeout=2545)
        qrcont=resp.read()
        #md = json.loads(qrcont)
        #md5 = md[name]
    conf = {'all_list':'success'
              }
    return HttpResponse(json.dumps(conf))    
#设计师个人中心页面，设计师本人看到的，即设计师个人主页。 
@login_required
def design_list(request):
    '''
	个人中心首页，按时间列出全部作品
    '''
    user = request.user
    designer = Designer_User.objects.get(user_id=user.id)
    designer.icon = str(adminer_website.icon_server_path) + designer.icon
    design_list = Goods.objects.filter(designer_id=designer.id)
    designer_marked = Vender_User.objects.filter(designer_id = designer.id).count()
    '''collect_num = 0
    all_list = []
    for design in design_list:
    	if design.collect > 1:
            collect_num = collect_num + 1'''

    conf = {'all_list':all_list,
            'marked':designer_marked
    		  }
    return render(request, website.all_list, conf)

#作品管理的 已发布7和设计师个人主页 都是用的这个部分方法实现
def downed_list(request):
    '''
    展示按照下载次数排序结果
    '''
    state = 1
    user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    design_list = Goods.objects.filter(designer_id=designer.id)
    click_count = 0#request.POST['click_count']
    state = click_count + state
    if state % 2 == 1:
        design_list = design_list.order_by('download_count')
    else:
        design_list = design_list.order_by('download_count').reverse()
    return_list = []
    for good in design_list:
        temp = {'id':good.id,
                'name':good.goods_name,
                'describe':good.description,
                'collected_count':good.collected_count,
                'download_count':good.download_count,
                'good_price':good.goods_price,
                'preview_1':str(website.file_server_path)+str(good.preview_1),
                'preview_2':str(website.file_server_path)+str(good.preview_2),
                'preview_3':str(website.file_server_path)+str(good.preview_3),
                #'stl_file_url':str(website.toy_server_imgupload)+str(photo.stl_file_url),
                'file_size':good.file_size
                }
        return_list.append(temp)

    conf = {'all_list':return_list
    		  }
    return HttpResponse(json.dumps(conf))

#按照被收藏的个数排序 collect_list
def collect_list(request):
    '''
    按照被收藏的个数排序
    '''
    state = 1
    user = request.user
    designer = Designer_User.objects.get(user_id=user.id)
    design_list = Goods.objects.filter(designer_id=designer.id)
    click_count = request.POST['click_count']
    state = click_count + state
    if state % 2 == 1:
        design_list = design_list.order_by('collected_count')
    else:
        design_list = design_list.order_by('collected_count').reverse()
    return_list = []
    for good in design_list:
        temp = {'id':good.id,
                'name':good.goods_name,
                'describe':good.description,
                'collected_count':good.collected_count,
                'download_count':good.download_count,
                'good_price':good.goods_price,
                'preview_1':str(website.file_server_path)+str(good.preview_1),
                'preview_2':str(website.file_server_path)+str(good.preview_2),
                'preview_3':str(website.file_server_path)+str(good.preview_3),
                #'stl_file_url':str(website.toy_server_imgupload)+str(photo.stl_file_url),
                'file_size':good.file_size
                }
        return_list.append(temp)

    conf = {'all_list':return_list
              }
    return HttpResponse(json.dumps(conf))

#最新上传的作品排序 new_list
def new_list(request):
    '''
    最新上传的作品排序
    '''
    state = 1
    user = request.user
    designer = Designer_User.objects.get(user_id=user.id)
    design_list = Goods.objects.filter(designer_id=designer.id)
    click_count = request.POST['click_count']
    state = click_count + state
    if state % 2 == 1:
        design_list = design_list.order_by('approval_time')
    else:
        design_list = design_list.order_by('approval_time').reverse()
    return_list = []
    for good in design_list:
        temp = {'id':good.id,
                'name':good.goods_name,
                'describe':good.description,
                'collected_count':good.collected_count,
                'download_count':good.download_count,
                'good_price':good.goods_price,
                'preview_1':str(website.file_server_path)+str(good.preview_1),
                'preview_2':str(website.file_server_path)+str(good.preview_2),
                'preview_3':str(website.file_server_path)+str(good.preview_3),
                #'stl_file_url':str(website.toy_server_imgupload)+str(photo.stl_file_url),
                'file_size':good.file_size
                }
        return_list.append(temp)

    conf = {'all_list':return_list
              }
    return HttpResponse(json.dumps(conf))
#搜索未发布商品的方法
def unpublished_good_search(request):
    describe = 'c'#request.POST['describe']
    designer = 1
    good_state = 0
    result_goods = search_handle.unexecuteed_search(describe,designer,good_state)
    print result_goods
    goods_find = []
    for good_id in result_goods:
        good = Goods_Upload.objects.get(id = good_id)
        temp = {'id':good.id,
                'designer_id':good.designer_id,
                'good_price':good.goods_price,
                'description':good.description,
                'tags':good.tags,
                'style':good.style,
                'stl_path':good.stl_path,
                'preview_1':str(website.file_server_path)+str(good.preview_1),
                'preview_2':str(website.file_server_path)+str(good.preview_2),
                'preview_3':str(website.file_server_path)+str(good.preview_3),
                'upload_time':good.upload_time,
                'modify_time':good.modify_time,
                'file_size':good.file_size,
                'good_state':good.good_state,
                'not_passed':good.not_passed
        }
        goods_find.append(temp)
    conf = {'goods_find':goods_find}
    return HttpResponse(json.dumps(conf))

#搜索已发布商品的方法  published_good_search
def published_good_search(request):
    describe = 'a'#request.POST['describe']
    designer = 1
    result_goods = search_handle.published_search(describe,designer)
    #pdb.set_trace()
    goods_find = []
    for good_id in result_goods:
        good = Goods.objects.get(id = good_id)
        temp = {'id':good.id,
                'designer_id':good.designer_id,
                'good_price':good.goods_price,
                'description':good.description,
                'tags':good.tags,
                'style':good.style,
                'stl_path':str(good.stl_path),
                'preview_1':str(website.file_server_path)+str(good.preview_1),
                'preview_2':str(website.file_server_path)+str(good.preview_2),
                'preview_3':str(website.file_server_path)+str(good.preview_3),
                #'approval_time':good.approval_time,
                'file_size':good.file_size,
                'collected_count':good.collected_count,
                'download_count':good.download_count
        }
        goods_find.append(temp)
    conf = {'goods_find':goods_find}
    return HttpResponse(json.dumps(conf))

#
def eardrop_list(request):
    user = request.user
    designer = Designer_User.objects.get(user_id=user.id)
    good_state = request.POST['good_state']
    design_list = good_filter(good_state,tags,designer.id)
    return_list = []
    for good in design_list:
        temp = {'id':good.id,
                'name':good.goods_name,
                'describe':good.description,
                'collected_count':good.collected_count,
                'download_count':good.download_count,
                'good_price':good.goods_price,
                'preview_1':str(website.file_server_path)+str(good.preview_1),
                'preview_2':str(website.file_server_path)+str(good.preview_2),
                'preview_3':str(website.file_server_path)+str(good.preview_3),
                #'stl_file_url':str(website.toy_server_imgupload)+str(photo.stl_file_url),
                'file_size':good.file_size
                }
        return_list.append(temp)

    conf = {'all_list':return_list
              }
    return HttpResponse(json.dumps(conf))
#def barcedt_list(request):



#def necklace_list(request):



def show_more(request):
    count = int(request.POST['count'])
    photo_lists = Goods.objects.all()
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
    for good in photo_lists:
        temp = {'id':good.id,
                'name':good.goods_name,
                'describe':good.description,
                'collected_count':good.collected_count,
                'download_count':good.download_count,
                'good_price':good.goods_price,
                'preview_1':str(website.file_server_path)+str(good.preview_1),
                'preview_2':str(website.file_server_path)+str(good.preview_2),
                'preview_3':str(website.file_server_path)+str(good.preview_3),
                #'stl_file_url':str(website.toy_server_imgupload)+str(photo.stl_file_url),
                'file_size':good.file_size
                }
        return_list.append(temp)

    conf = {'all_list':return_list
              }
    return HttpResponse(json.dumps(conf))

#显示我的动态的页面 my_state
def my_state(request):
    user = request.user
    designer = Designer_User.objects.filter(user_id=user.id)
    unpublished_list = Goods_Upload.objects.filter(designer_id=designer.id)
    published_list = Goods.objects.filter(designer_id=designer.id)
    collect = 0
    download = 0
    all_list = 0
    for good in published_list:
        if good.collected_count > 0:
            collect = collect + 1
        if good.download_count > 0:
            download = download + 1
    all_list = unpublished_list.count() + published_list.count()
    conf = { 'all_count':all_list,
            'collect':collect,
            'download':download,
            'marked_count':designer.marked_count

            }
    return render(request, website.my_state, conf)


