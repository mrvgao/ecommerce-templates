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
from configuration.models import Goods_Upload
from django.contrib.auth.models import User
import httplib, urllib
import urllib2,os
from datetime import date ,datetime
import time
import json,pdb


def index(request):
    return render(request, website.index)

def jwary_save(stls,ids):
    stl_md5s = {}
    count = 0
    for stl in stls:
        #pdb.set_trace()         
        stl_type=str(stl)
        stl_type=stl_type.split('.')
        stl_md5 = file_save(stl,stl_type[0],ids[count],stl_type[1])
        stl_md5s.setdefault(stl_type[0],stl_md5)
    return stl_md5s

#@login_required
def works_save(request):
    #pdb.set_trace()
    if request.method == 'POST':
        a_have = True
        jwary_stl = request.FILES.getlist('jiezhi')
        #drop_stl = request.FILES.getlist('2')
        #eardrop_stl = request.FILES.getlist('3')
        #twist_stl = request.FILES.getlist('4')
        #necklace_stl = request.FILES.getlist('5')
        ##needle_stl = request.FILES.getlist('6')
        file_size = []
        ids = []
        #pdb.set_trace()
        count = 0
        if jwary_stl:
            for stl in jwary_stl:
                size = len(stl)
                file_size.append(size)
                new = Goods_Upload.objects.create(designer_id = 1)
                ids.append(new.id)
                print size,ids
            print file_size
            jwary_md5=jwary_save(jwary_stl,ids)
            for md5 in jwary_md5:
                stl_url = str(jwary_md5[md5])+'.stl'
                tags = 'Jweary'
                print md5,stl_url
                new_jwary = Goods_Upload.objects.filter(id = ids[count]).update(goods_name = str(md5),
                                        #designer_id = 1,
                                         stl_path = str(stl_url),
                                         tags = tags,
                                         file_size = str(float('%0.3f'%(file_size[count]/1024.0/1024.0)))+'M'
                                        )
                count = count + 1

            return render(request, website.up_success)
        else:
            return render(request, website.up_error)


def file_save(model,name,this_id,stl_type):
    #pdb.set_trace()
    chunks = ""
    for chunk in model.chunks():
        chunks = chunks + chunk
    boundary = '----------%s' % hex(int(time.time() * 1000))
    data = []
    data.append('--%s' % boundary)
    data.append('Content-Disposition: form-data; name="%s"\r\n' % 'style')
    data.append(stl_type)
    data.append(this_id)
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
    return md5


def workd_execute(request):
    user = request.user
    designer = Designer.objects.get(user_id=user.id)
    designer.icon = str(website.icon_server_path) + designer.icon
    unpass_list = Goods_Upload.objects.filter(customer_id=customer.id)
    conf = {'all_list':unpass_list,
            'icon' : designer.icon,
            'name':designer.name,
              }
    return render(request, website.all_list, conf)

def delete(request):
    ids = request.POST['ids']
    for id in ids:
        Goods_Upload.objects.remove(id = id)
    conf = {'status':"success"}
    return HttpResponse(json.dumps(conf))

def photo_edit(request):
    id = request.POST['id']
    photo = Goods_Upload.objects.filter(id=id)
    conf = {'photo':'photo'}
    return HttpResponse(json.dumps(conf))

#未处理页面，点击处理并提交 的处理表单；同时也是 未通过，点击重生申请发布的 处理表单
def edit_submit(request):
    file_id = request.POST['id']
    photo = Goods_Upload.objects.filter(id=file_id)
    price = request.POST['price']
    preview_1 = request.FILES['preview_1']
    preview_2 = request.FILES['preview_2']
    preview_3 = request.FILES['preview_3']
    describe = request.POST['describe']
    name = request.POST['name']
    if not name:
        name = photo.name
    if not describe:
        describe = photo.describe
    if preview_1:
        preview_1_type=str(preview_1)
        preview_1_type=preview_1_type.split('.')
        preview_1_md5 = file_save(preview_1,name,file_id,preview_1_type[1])
        p1_url = str(preview_1_md5)+'.'+str(preview_1_type[1])
    else:
        preview_1 = photo.preview_1
    if preview_2:
        preview_2_type=str(preview_2)
        preview_2_type=preview_2_type.split('.')
        preview_2_md5 = file_save(preview_2,name,preview_2_type[1])
        p2_url = str(preview_2_md5)+'.'+str(preview_2_type[1])
    else:
        preview_2 = photo.preview_2
    if preview_3:
        preview_3_type=str(preview_3)
        preview_3_type=preview_3_type.split('.')
        preview_3_md5 = file_save(preview_3,name,preview_3_type[1])
        p3_url = str(preview_3_md5)+'.'+str(preview_3_type[1])
    else:
        preview_3 = photo.preview_3
    s=Goods_Uploadobjects.filter(id= id).update(name=str(name),
                        price = int(price),
                        preview_1 = p1_url,
                        preview_2 = p2_url,
                        preview_3 = p3_url,
                        describe = describe
                      )
    conf = {'status':"success"}
    return HttpResponse(json.dumps(conf))


#未通过页面，点击重新申请发布
def photo_not_passed(request):#未通过页面，点击重新申请发布
    id = request.POST['id']
    photo = Goods_Upload.objects.filter(id=id)
    conf = {'photo':'photo'}
    return HttpResponse(json.dumps(conf))





def auditing(request):#审核中
    user = request.user
    designer = Designer.objects.get(user_id=user.id)
    photo = Goods_Upload.objects.filter(design_id=design.id)
    conf = {'photo':'photo'}
    return HttpResponse(json.dumps(conf))


def has_published(request):#显示已发布页面
    user = request.user
    designer = Designer.objects.get(user_id=user.id)
    photo = Goods.objects.filter(design_id=design.id)
    conf = {'photo':'photo'}
    return HttpResponse(json.dumps(conf))
def published_edit(request):#在已发布页面点击编辑后，传的值
    id = request.POST['id']
    photo = Goods.objects.get(id=id)
    conf = {'photo':'photo'}
    return HttpResponse(json.dumps(conf))


def published_submit(request):#在已发布页面点击编辑后，修改后提交的值
    file_id = request.POST['id']
    photo = Goods_Upload.objects.filter(id=file_id)
    price = request.POST['price']
    describe = request.POST['describe']
    name = request.POST['name']
    if not name:
        name = photo.name
    if not describe:
        describe = photo.describe
    if not price:
        price = photo.price
    s=Goods_Uploadobjects.filter(id= id).update(name=str(name),
                        price = int(price),
                        describe = describe
                      )
    conf = {'status':"success"}
    return HttpResponse(json.dumps(conf))

def published_delete(request):#在已发布页面点击编辑后，点击删除
    pass

