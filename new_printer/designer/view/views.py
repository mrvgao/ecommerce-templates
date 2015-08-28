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
from designer.utilites import search_handle,good_filter
import json, os, uuid, base64, platform, requests
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext
from django import forms
from django.contrib.auth.models import User
from configuration.models import Goods_Upload
from configuration.models import Designer_User
from configuration.models import Vender_Goods
from configuration.models import Goods
from configuration.models import Vender_User
from configuration.models import Design_record
from configuration.models import Good_record
from configuration.models import Vender_Designer
import httplib, urllib
import urllib2,os
from datetime import date ,datetime,timedelta
import time,pdb


@login_required
def my_personal(request):
    '''
	#设计师个人中心页面，设计师本人看到的，即设计师个人主页。 
    '''
    #user = request.user
    designer = Designer_User.objects.get(user_id = 1)#user.id)
    is_focus = False
    designer_marked = Vender_Designer.objects.filter(designer_id = designer.id).count()
    designer.img = str(server_website.file_server_path) + str(designer.img)
    d_user = Designer_User.objects.filter(user_id = 2).exists()
    if (d_user):
        now_user = 'D'
    else:
        now_user = 'V'
        if Vender_Designer.objects.filter(designer_id = designer.id, vender_id = 2):
            is_focus = True
    design_list = Goods.objects.filter(designer_id = designer.id)
    return_list = []
    for good in design_list:
        is_collect = False
        _good = {}
        if Vender_Goods.objects.filter(goods_id = good.id, vender_id = 2):
            is_collect = True
        print is_collect
        print good.id
        _good = {'goods_name': good.goods_name, 'id': good.id, 'download_count': good.download_count,
         'collected_count': good.collected_count, 'goods_price': good.goods_price, 'is_collect': is_collect,
         'preview_1': server_website.file_server_path + good.preview_1 }
        return_list.append(_good)
    
    conf = {'other_goods_list': return_list, 'designer_img': designer.img, 'designer_name': designer.designername,
            'marked': designer_marked, 'now_user': now_user, 
            'is_focus': is_focus
    		  }
    return render(request, website.my_personal, conf)


def downed_list(request):
    '''
    展示按照下载次数排序结果,#作品管理的 已发布7和设计师个人主页 都是用的这个部分方法实现
    '''
    state = 1
    #pdb.set_trace()
    user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    design_list = Goods.objects.filter(designer_id=designer.id)
    click_count = int(request.POST['click_count'])
    state = click_count + state
    if state % 2 == 1:
        design_list = design_list.order_by('download_count')
    else:
        design_list = design_list.order_by('download_count').reverse()
    return_list = good_filter.publish_exec(design_list)
    designer_marked = Vender_Designer.objects.filter(designer_id = designer.id).count()
    conf = {'all_list': return_list
            }
    return HttpResponse(json.dumps(conf))


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


def unpublished_good_search(request):
    '''
    #搜索商品的方法
    '''
    describe = request.POST['search_val']
    designer = 1
    good_state = int(request.POST['search_type'])
    if good_state<3:
        result_goods = search_handle.unexecuteed_search(describe,designer,good_state)
        goods_find = []
        for good_id in result_goods:
            good = Goods_Upload.objects.get(id = good_id)
            temp = {'id':good.id,
                    'designer_id':good.designer_id,
                    'good_price':good.goods_price,
                    'name':good.goods_name,
                    'description':good.description,
                    'tags':good.tags,
                    'style':good.style,
                    'type':'stl',
                    'stl_path':good.stl_path,
                    'preview_1':str(server_website.file_server_path)+str(good.preview_1),
                    'preview_2':str(server_website.file_server_path)+str(good.preview_2),
                    'preview_3':str(server_website.file_server_path)+str(good.preview_3),
                    'upload_time':good.upload_time.strftime("%Y-%m-%d"),
                    'modify_time':good.modify_time.strftime("%Y-%m-%d"),
                    'file_size':good.file_size,
                    'good_state':good.good_state,
                    'not_passed':good.not_passed
            }
            goods_find.append(temp)
        conf = {'all_list':goods_find}
    else:
        result_goods = search_handle.published_search(describe,designer)
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
                    'preview_1':str(server_website.file_server_path)+str(good.preview_1),
                    'preview_2':str(server_website.file_server_path)+str(good.preview_2),
                    'preview_3':str(server_website.file_server_path)+str(good.preview_3),
                    'approval_time':good.approval_time.strftime("%Y-%m-%d"),
                    'file_size':good.file_size,
                    'collected_count':good.collected_count,
                    'download_count':good.download_count
            }
            goods_find.append(temp)
    total_pages = len(goods_find)/2+1
    conf = {'all_list':goods_find,'total_pages':total_pages}
    return HttpResponse(json.dumps(conf))


def published_good_search(request):
    '''
    #搜索已发布商品的方法  published_good_search
    '''
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
                'preview_1':str(server_website.file_server_path)+str(good.preview_1),
                'preview_2':str(server_website.file_server_path)+str(good.preview_2),
                'preview_3':str(server_website.file_server_path)+str(good.preview_3),
                'approval_time':good.approval_time.strftime("%Y-%m-%d"),
                'file_size':good.file_size,
                'collected_count':good.collected_count,
                'download_count':good.download_count
        }
        goods_find.append(temp)
    conf = {'goods_find':goods_find}
    return HttpResponse(json.dumps(conf))


def unpublish_eardrop_list(request):
    '''
    #未发布的商品过滤 耳坠
    '''
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    good_state = 0#request.POST['good_state']
    tags = 'Jweary'
    return_list = good_filter.unpublish_good_filter(good_state,tags,designer.id)
    conf = {'all_list':return_list
              }
    return HttpResponse(json.dumps(conf))


def publish_eardrop_list(request):
    '''
    #已发的商品过滤 ，耳坠
    '''
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    tags = '戒指'
    return_list = good_filter.publish_good_filter(tags,designer.id)
    conf = {'all_list':return_list
              }
    return HttpResponse(json.dumps(conf))


def my_state(request):
    '''
    #显示我的动态的页面 my_state
    '''
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
    designer_record = Design_record.objects.filter(designer_id=designer.id)
    now = datetime.now()
    design_week = [0]
    good_week = [0]
    published_list = Goods.objects.filter(designer_id=designer.id)
    for time in range(7):
        start = now - timedelta(days=time,hours=23)
        a=designer_record.filter(d_visit_time__gte=start)
        a = len(a) - sum(design_week)
        design_week.append(a)
    for time in range(7):
        record = 0
        for good in published_list:
            goods_record = Good_record.objects.filter(good_id=good.id)
            start = now - timedelta(days=time,hours=23)
            a=goods_record.filter(g_visit_time__gte=start)
            record = record+len(a)
        record = record - sum(good_week)
        good_week.append(record)
    conf = { 'worksNum':all_list,
            'worksCollection':collect,
            'downloadNum':download,
            'focusNum':designer.marked_count,
            'p_weekNum':design_week,
            'weekNum':good_week,
            'name':designer.designername,
            'img':str(server_website.file_server_path)+str(designer.img)
            }
    return render(request, website.my_state, conf)


def center_visit(request):
    '''
    #设计师的 day 访问量
    '''
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    now = datetime.now()
    weekNum = [0]
    designer_record = Design_record.objects.filter(designer_id=designer.id)
    for time in range(7):
        start = now - timedelta(days=time,hours=23)
        a=designer_record.filter(d_visit_time__gte=start)
        a = len(a) - sum(weekNum)
        weekNum.append(a)
    monthNum = [0]
    for time in range(30):
        start = now - timedelta(days=time,hours=23)
        a=designer_record.filter(d_visit_time__gte=start)
        a = len(a) - sum(monthNum)
        monthNum.append(a)
    conf = { 'weekNum':weekNum,'monthNum':monthNum}
    return HttpResponse(json.dumps(conf))


def design_month_visit(request):
    '''
    #设计师的  month 访问量
    '''
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


def works_visit(request):
    '''
    #设计师作品的 访问量
    '''
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    now = datetime.now()
    weekNum = []
    published_list = Goods.objects.filter(designer_id=designer.id)
    for time in range(7):
        record = 0
        for good in published_list:
            goods_record = Good_record.objects.filter(good_id=good.id)
            start = now - timedelta(days=time,hours=23)
            a=goods_record.filter(g_visit_time__gte=start)
            record = record+len(a)
        record = record - sum(weekNum)
        weekNum.append(record)
    monthNum = []
    for time in range(30):
        record = 0
        for good in published_list:
            goods_record = Good_record.objects.filter(good_id=good.id)
            start = now - timedelta(days=time,hours=23)
            a=goods_record.filter(g_visit_time__gte=start)
            record = record+len(a)
        record = record - sum(monthNum)
        monthNum.append(record)
    conf = { 'weekNum':weekNum,'monthNum':monthNum}
    return HttpResponse(json.dumps(conf))


def good_month_visit(request):
    '''
    #设计师的作品  month 访问量
    '''
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


def setup(request):
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    conf = {'name':designer.designername,'img':str(server_website.file_server_path)+str(designer.img) }
    return render(request, website.setup, conf)


def change_icon(request):
    return render(request,website.change_icon)


def show_3d(request):
    id = request.POST['pic_id']
    _url = str(server_website.file_server_path) + Goods_Upload.objects.get(id=id).stl_path
    url_path = good_filter.down_stl(_url)
    conf = { 'url_path':url_path}
    return HttpResponse(json.dumps(conf)) 

def add_focus(request):
    d_id = request.POST['d_id']
    v_id = request.POST['v_id']
    new_collect = Vender_Designer.objects.create(designer_id = d_id, vender_id = v_id)
    return HttpResponse(json.dumps("success"))


def cancel_focus(request):
    d_id = request.POST['d_id']
    v_id = request.POST['v_id']
    new_collect = Vender_Designer.objects.filter(designer_id = d_id, vender_id = v_id).delete()
    return HttpResponse(json.dumps("success"))

def add_collect(request):
    #pdb.set_trace()
    g_id = request.POST['g_id']
    v_id = request.POST['v_id']
    this_good = Vender_Goods.objects.filter(goods_id = g_id, vender_id = v_id)
    if  this_good:
        now_collect = this_good.update(is_collected = True)
    else:
        new = Vender_Goods.objects.create(goods_id = g_id, vender_id = v_id, is_collected = True, 
            collected_time = datetime.now())
    return HttpResponse(json.dumps("success"))

def cancel_collect(request):
    g_id = request.POST['g_id']
    v_id = request.POST['v_id']
    cancel_collect = Vender_Goods.objects.filter(goods_id = g_id, vender_id = v_id).delete()
    return HttpResponse(json.dumps("success"))
