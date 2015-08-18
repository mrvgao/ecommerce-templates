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


def index(request):
    return render(request, website.edit)

def stls_save(stls):
    jwary_md5 = {}
    file_size = []
    has_existed = {}
    count = 0
    for stl in stls:
        #pdb.set_trace()         
        stl_type=str(stl)
        stl_type=stl_type.split('.')
        stl_md5 = file_save(stl,stl_type[0],stl_type[1])
        size = len(stl)
        file_size.append(size)
        stl_type=str(stl)
        stl_type=stl_type.split('.')
        stl_md5 = file_save(stl,stl_type[0],stl_type[1])
        stl_path = str(stl_md5) + '.stl'
        if not Goods_Upload.objects.filter(stl_path=stl_path).exists():
            jwary_md5.setdefault(stl_type[0],stl_md5)
        else:
            has_existed.setdefault(stl_type[0],stl_md5)
    for md5 in jwary_md5:
        stl_url = str(jwary_md5[md5])+'.stl'
        tags = 'Jweary'
        new_jwary = Goods_Upload.objects.create(goods_name = str(md5),
                                         designer_id = 1,
                                         stl_path = str(stl_url),
                                         tags = tags,
                                         file_size = str(float('%0.3f'%(file_size[count]/1024.0/1024.0)))+'M',
                                         good_state = 0,
                                         #preview_1 = ,
                                         #preview_2 = ,
                                         #preview_3 = ,
                                        )
        count = count + 1
    print has_existed
    return has_existed
#@login_required
def works_save(request):
    #pdb.set_trace()
    if request.method == 'POST':
        a_have = True
        jwary_stl = request.FILES.getlist('jiezhi')
        drop_stl = request.FILES.getlist('2')
        eardrop_stl = request.FILES.getlist('3')
        twist_stl = request.FILES.getlist('4')
        necklace_stl = request.FILES.getlist('5')
        needle_stl = request.FILES.getlist('6')
        file_hased = []
        #ids = []
        count = 0
        if jwary_stl:
            existed = stls_save(jwary_stl)
            if existed:
                for i in existed:
                    conf = {'hased':i}
                    file_hased.append(conf)
        if drop_stl:
            stls_save(drop_stl)
        return HttpResponse(json.dumps(file_hased))
    else:
        return render(request, website.up_error)


def file_save(model,name,stl_type):
    #pdb.set_trace()
    chunks = ""
    for chunk in model.chunks():
        chunks = chunks + chunk
    boundary = '----------%s' % hex(int(time.time() * 1000))
    data = []
    data.append('--%s' % boundary)
    data.append('Content-Disposition: form-data; name="%s"\r\n' % 'style')
    data.append(stl_type)
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
    req.add_header('Referer','%s'%website.toy_server_ip)#'http://192.168.1.101:8888/')
    resp = urllib2.urlopen(req, timeout=2545)
    qrcont=resp.read()
    md = json.loads(qrcont)
    md5 = md['status']
    return md5

#设计师作品管理，显示 未处理 页面  #商品状态，0：只有STl,未处理；1：审核中； 2：未通过 3:审核通过， 新加
def workd_unexecute(request):
    user = 1#request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    designer.icon = str(website.toy_server_imgupload) + str(designer.img)
    unexecute_list = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 0)
    conf = {'all_list':unexecute_list,
            'icon' : designer.icon,
            'name':designer.designername,
              }
    return render(request, website.all_list, conf)

#在未处理页面直接删除作品
def unexecute_delete(request):
    ids = request.POST['ids']
    for id in ids:
        Goods_Upload.objects.filter(id = id).delete()
    conf = {'status':"success"}
    return HttpResponse(json.dumps(conf))

#在未处理页面 点击处理并提交 后往JS传得值
def unexecute_edit(request):
    id = request.POST['id'] 
    good = Goods_Upload.objects.get(id = id)
    return_good = {
                    'id':good.id,
                    'name':good.goods_name
 #                   ''
                }

#未处理页面，点击处理并提交 的处理表单；同时也是 未通过，点击重生申请发布的 处理表单
def edit_submit(request):
    #file_id = request.POST['id']
    file_id = 44
    count = 1
    p_url = []
    #pdb.set_trace()
    photo = Goods_Upload.objects.get(id=file_id)
    stl_md5 = photo.stl_path
    print stl_md5
    stl_md5 = str(stl_md5).split('.')
    stl_md5 = stl_md5[0]
    price = request.POST['price']
    #previews = request.FILES.getlist['photo']
    previews = request.FILES['photo']
    describe = request.POST['describe']
    #name = request.POST['edit_name']
    '''if not name:
        name = photo.name'''
    if previews:
        #for preview_one in previews:
        preview_type=str(previews)
        preview_type=preview_type.split('.')
        preview_md5 = photo_save(previews,preview_type[0],preview_type[1],stl_md5)
        p1_url = str(stl_md5) + '/' + str(preview_type[0]) + '.' + str(preview_type[1])
        p_url.append(p1_url)

    s=Goods_Upload.objects.filter(id= file_id).update(#name=str(name),
                        goods_price = int(price),
                        preview_1 = p_url[0],
                        #preview_2 = p_url[1],
                        #preview_3 = p_url[2],
                        good_state = 1,
                        description = describe
                      )
    conf = {'status':"success"}
    return HttpResponse(json.dumps(conf))
    '''else:
        s=Goods_Uploadobjects.filter(id= id).update(name=str(name),
                        price = int(price),
                        describe = describe
                      )
        conf = {'status':"success"}
        return HttpResponse(json.dumps(conf))'''
def photo_save(model,name,stl_type,stl_md5):
    #pdb.set_trace()
    chunks = ""
    for chunk in model.chunks():
        chunks = chunks + chunk
    boundary = '----------%s' % hex(int(time.time() * 1000))
    data = []
    data.append('--%s' % boundary)
    data.append('Content-Disposition: form-data; name="%s"\r\n' % 'style')
    data.append(stl_type)
    data.append('--%s' % boundary)
    data.append('Content-Disposition: form-data; name="%s"\r\n' % 'md5')
    data.append(stl_md5)
    data.append('--%s' % boundary)
    data.append('Content-Disposition: form-data; name="%s"; filename="%s"' % ('profile',str(name)))
    data.append('Content-Type: %s\r\n' % 'image/png')
    data.append(chunks)
    data.append('--%s--\r\n' % boundary)
    http_url = website.toy_server_imgupload#'http://192.168.1.101:8888/file/imgupload'
    http_body = '\r\n'.join(data)
    req = urllib2.Request(http_url, data=http_body)
    req.add_header('Content-Type', 'multipart/form-data; boundary=%s' % boundary)
    req.add_header('User-Agent','Mozilla/5.0')
    req.add_header('Referer','%s'%website.toy_server_ip)#'http://192.168.1.101:8888/')
    resp = urllib2.urlopen(req, timeout=2545)
    qrcont=resp.read()
    md = json.loads(qrcont)
    print md
    md5 = md['status']
    print md5
    return md5

#未通过页面，点击 重新申请发布 后的反馈操作
def photo_not_passed(request):#未通过页面，点击重新申请发布
    id = 38#request.POST['id']
    photo = Goods_Upload.objects.filter(id=id)
    conf = {'photo':photo}
    return HttpResponse(json.dumps(conf))




#审核中,显示未审核
def auditing(request):
    user = request.user
    designer = Designer.objects.get(user_id=user.id)
    photo = Goods_Upload.objects.filter(design_id=design.id,good_state = 1)
    conf = {'photo':photo}
    return HttpResponse(json.dumps(conf))

#显示已发布页面
def has_published(request):
    user = request.user
    designer = Designer_User.objects.get(user_id=user.id)
    goods = Goods.objects.filter(designer_id=designer.id)
    goods_all = []
    for good in goods:
        venders = Vender_Goods.objects.get(goods_id = good.id)
        this_good = {'goods_name':good.goods_name,
                    'preview_1':str(good.preview_1),
                    'preview_2':str(good.preview_2),
                    'preview_3':str(good.preview_3),
                    'goods_price':good.goods_price,
                    'description':good.description,
                    'download_count':good.download_count
                    }
        #count = 1
        for vender in venders:
            vender = Vender_User.objects.get(id=vender)
            this_good[count]=vender.img
        goods_all.append(this_good)               
    conf = {'goods':goods_all
            }
    return HttpResponse(json.dumps(conf))

#在已发布页面点击编辑后，传的值
def published_edit(request):
    id = request.POST['id']
    photo = Goods.objects.get(id=id)
    conf = {'photo':photo}
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
    s=Goods.objects.filter(id = id).update(name=str(name),
                        price = int(price),
                        describe = describe
                      )
    conf = {'status':"success"}
    return HttpResponse(json.dumps(conf))

def published_delete(request):#在已发布页面点击编辑后，点击删除
    del_id = request.POST['id']
    for id in ids:
        Goods.objects.filter(id = id).delete()
    if delete:
        conf = {'status':"success"}
    else:
        conf = {'status':'eror'}
    return HttpResponse(json.dumps(conf))


