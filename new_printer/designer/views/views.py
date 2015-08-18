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
from designer.utilites import search_handle,good_filter
import json, os, uuid, base64, platform, requests
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext
from django import forms
from django.contrib.auth.models import User
from configuration.models import Goods_Upload,Designer_User,Vender_Goods,Goods,Vender_User,Design_record,Good_record
import httplib, urllib
import urllib2,os
from datetime import date ,datetime,timedelta
import time
import json,pdb


'''def download_work(request):
    ids = [38]#request.POST['id']
    for id in ids:
        this_work = Goods_Upload.objects.get(id=id)
        name = this_work.goods_name + '.zip'
        stl_md5 = this_work.stl_path
        stl_md5 = stl_md5.split('.')
        stl_md5 = stl_md5[0]
    #file_server_download
    #pdb.set_trace()
    #new = open("test.zip",'w')
    r=urllib2.urlopen("%s/%s/%s"%(website.file_server_download,stl_md5,name))
    print len(f.read())
    with open("test.zip",'w') as f:

        for chunk in r.iter_content(chunk_size=1024):

            if chunk:  # filter out keep-alive new chunks

                f.write(chunk)

                f.flush()

                return local_filename
    #new.close()
    #print a
    conf = {'all_list':'success'
              }
    return HttpResponse(json.dumps(conf))'''
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
    print len(design_list)
    return_list = good_filter.publish_exec(design_list)
    conf = {'all_list':return_list
    		  }
    return HttpResponse(json.dumps(conf))

#按照被收藏的个数排序 collect_list
def collect_list(request):
    '''
    按照被收藏的个数排序
    '''
    state = 1
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    design_list = Goods.objects.filter(designer_id=designer.id)
    click_count = 1#request.POST['click_count']
    state = click_count + state
    if state % 2 == 1:
        design_list = design_list.order_by('collected_count')
    else:
        design_list = design_list.order_by('collected_count').reverse()
    return_list = good_filter.publish_exec(design_list)
    conf = {'all_list':return_list
              }
    return HttpResponse(json.dumps(conf))

#最新上传的作品排序 new_list
def new_list(request):
    '''
    最新上传的作品排序
    '''
    state = 1
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    design_list = Goods.objects.filter(designer_id=designer.id)
    click_count = request.POST['click_count']
    state = click_count + state
    if state % 2 == 1:
        design_list = design_list.order_by('approval_time')
    else:
        design_list = design_list.order_by('approval_time').reverse()
    return_list = good_filter.publish_exec(design_list)
    conf = {'all_list':return_list
              }
    return HttpResponse(json.dumps(conf))
#搜索未发布商品的方法
def unpublished_good_search(request):
    describe = 'c'#request.POST['describe']
    designer = 1
    good_state = 0
    result_goods = search_handle.unexecuteed_search(describe,designer,good_state)
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
                'upload_time':good.upload_time.strftime("%Y-%m-%d"),
                'modify_time':good.modify_time.strftime("%Y-%m-%d"),
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
                'approval_time':good.approval_time.strftime("%Y-%m-%d"),
                'file_size':good.file_size,
                'collected_count':good.collected_count,
                'download_count':good.download_count
        }
        goods_find.append(temp)
    conf = {'goods_find':goods_find}
    return HttpResponse(json.dumps(conf))

#未发布的商品过滤 耳坠
def unpublish_eardrop_list(request):
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    good_state = 0#request.POST['good_state']
    tags = 'Jweary'
    return_list = good_filter.unpublish_good_filter(good_state,tags,designer.id)
    conf = {'all_list':return_list
              }
    return HttpResponse(json.dumps(conf))

#已发的商品过滤 ，耳坠
def publish_eardrop_list(request):
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    tags = '戒指'
    return_list = good_filter.publish_good_filter(tags,designer.id)
    conf = {'all_list':return_list
              }
    return HttpResponse(json.dumps(conf))
#在设计师个人中心 显示更多
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
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    unpublished_list = Goods_Upload.objects.filter(designer_id=designer.id)
    published_list = Goods.objects.filter(designer_id=designer.id)
    collect = 0
    download = 0
    all_list = 0
    for good in published_list:
        if good.collected_count > 0:
            collect = collect + 1
        #if good.download_count > 0:
        download = download + good.download_count
    all_list = unpublished_list.count() + published_list.count()
    now = datetime.now()
    design_day = [0]
    good_day = [0]
    designer_record = Design_record.objects.filter(designer_id=designer.id)
    for time in range(24):
        start = now - timedelta(hours=time,minutes=59, seconds=59)
        a=designer_record.filter(d_visit_time__gte=start)
        a = len(a) - sum(design_day)
        design_day.append(a)
    for time in range(24):
        record = 0
        for good in published_list:
            goods_record = Good_record.objects.filter(good_id=good.id)
            start = now - timedelta(hours=time,minutes=59, seconds=59)
            a=goods_record.filter(g_visit_time__gte=start)
            record = record+len(a)
        record = record - sum(good_day)
        good_day.append(record)
    conf = { 'all_count':all_list,
            'collect':collect,
            'download':download,
            'marked_count':designer.marked_count,
            'd_records':design_day,
            'g_record':good_day
            }
    return HttpResponse(json.dumps(conf))#return render(request, website.my_state, conf)

#设计师的 day 访问量
def design_week_visit(request):
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    now = datetime.now()
    design_week = [0]
    designer_record = Design_record.objects.filter(designer_id=designer.id)
    for time in range(7):
        start = now - timedelta(days=time,hours=23)
        a=designer_record.filter(d_visit_time__gte=start)
        a = len(a) - sum(design_week)
        design_week.append(a)
    conf = { 'design_week':design_week}
    return HttpResponse(json.dumps(conf))

#设计师的  month 访问量
def design_month_visit(request):
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    now = datetime.now()
    design_month = [0]
    designer_record = Design_record.objects.filter(designer_id=designer.id)
    for time in range(30):
        start = now - timedelta(days=time,hours=23)
        a=designer_record.filter(d_visit_time__gte=start)
        a = len(a) - sum(design_month)
        design_month.append(a)
    conf = { 'design_month':design_month}
    return HttpResponse(json.dumps(conf))

#设计师作品的 day 访问量
def good_week_visit(request):
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    now = datetime.now()
    good_week = [0]
    published_list = Goods.objects.filter(designer_id=designer.id)
    for time in range(7):
        record = 0
        for good in published_list:
            goods_record = Good_record.objects.filter(good_id=good.id)
            start = now - timedelta(days=time,hours=23)
            a=goods_record.filter(g_visit_time__gte=start)
            record = record+len(a)
        record = record - sum(good_week)
        good_week.append(record)
    
    conf = { 'good_week':good_week}
    return HttpResponse(json.dumps(conf))

#设计师的作品  month 访问量
def good_month_visit(request):
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    now = datetime.now()
    good_month = [0]
    published_list = Goods.objects.filter(designer_id=designer.id)
    for time in range(30):
        record = 0
        for good in published_list:
            goods_record = Good_record.objects.filter(good_id=good.id)
            start = now - timedelta(days=time,hours=23)
            a=goods_record.filter(g_visit_time__gte=start)
            record = record+len(a)
        record = record - sum(good_month)
        good_month.append(record)
    
    conf = { 'good_month':good_month}
    return HttpResponse(json.dumps(conf))
