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
from designer.utilites import search_handle,good_filter
from configuration.models import Goods_Upload,Designer_User,Vender_Goods,Goods
from django.contrib.auth.models import User
import httplib, urllib
import urllib2,os
from datetime import date ,datetime
import time
import json,pdb,hashlib

#(website.unexec_one)=2

def works_upload(request):
    designer = Designer_User.objects.get(user_id=1)#user.id)
    conf = {'name':designer.designername,'img':str(website.file_server_path)+str(designer.img) }
    return render(request, website.upfile,conf)

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
        
        chunks = ""
        for chunk in stl.chunks():
            chunks = chunks + chunk
        mde = hashlib.md5(chunks).hexdigest()
        print "stl_md5",stl_md5
        print "mde",mde
        stl_path = str(stl_md5) + '.stl'
        if not Goods_Upload.objects.filter(stl_path=stl_path).exists():
            jwary_md5.setdefault(stl_type[0],stl_md5)
        else:
            has_existed.setdefault(stl_type[0],stl_md5)
    for md5 in jwary_md5:
        stl_url = str(jwary_md5[md5])+'.stl'
        new_jwary = Goods_Upload.objects.create(goods_name = str(md5),
                                         designer_id = 1,
                                         stl_path = str(jwary_md5[md5]) + '/' + str(md5) +'.stl',
                                         file_size = str(float('%0.3f'%(file_size[count]/1024.0/1024.0)))+'M',
                                         good_state = 0,
                                         not_passed = 'null',
                                         preview_1 = 'photo.png'
                                         )
        count = count + 1
    print has_existed
    return has_existed

#@login_required
def works_save(request):
    if request.method == 'POST':
        a_have = True
        stls = request.FILES.getlist('upfile-img')
        file_hased = []
        count = 0
        if stls:
            existed = stls_save(stls)
            if existed:
                for i in existed:
                    conf = {'hased':i}
                    file_hased.append(conf)
        return HttpResponseRedirect('designer_works')
        #return HttpResponse(json.dumps(file_hased))
    else:
        return HttpResponse(json.dumps("Error"))


def file_save(model,name,stl_type):
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
    http_url = website.file_server_upload#'http://192.168.1.104:8888/file/upload'
    http_body = '\r\n'.join(data)
    req = urllib2.Request(http_url, data=http_body)
    req.add_header('Content-Type', 'multipart/form-data; boundary=%s' % boundary)
    req.add_header('User-Agent','Mozilla/5.0')
    req.add_header('Referer','%s'%website.file_server_ip)#'http://192.168.1.101:8888/')
    resp = urllib2.urlopen(req, timeout=10)
    qrcont=resp.read()
    md = json.loads(qrcont)
    md5 = md['status']
    return md5


'''def stl_delete(request):

    #上传STL文件处的删除操作

    del_id = request.POST['id']
    Goods_Upload.objects.filter(id = del_id).delete()
    conf = {'status':'success'}
    return HttpResponse(json.dumps(conf)) '''


def workd_unexecute(request):
    '''
    #设计师作品管理，显示 未审核 页面  #商品状态，0：只有STl,未处理；1：审核中； 2：未通过 3:审核通过， 新加
    '''
    user = 1#request.user
    now_page = int(request.POST['page']) - 1    
    designer = Designer_User.objects.get(user_id=1)#user.id)
    designer.icon = str(website.file_server_imgupload) + str(designer.img)
    unexecute_list = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 0)
    return_list = good_filter.unpublish_exec(unexecute_list)
    worksWait = unexecute_list.count()
    worksOn = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 1).count()
    worksNot = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 2).count()
    worksSuc = Goods.objects.filter(designer_id=designer.id).count()
    all_len = len(unexecute_list)
    total_pages = all_len/(website.unexec_one)
    if all_len%(website.unexec_one)!=0:
        total_pages += 1
    last_page = all_len%(website.unexec_one)
    return_list = return_list[now_page*(website.unexec_one):(now_page+1)*(website.unexec_one)]
    conf = {'all_list':return_list,
            'icon' : designer.icon,
            'name':designer.designername,'total_pages':total_pages,'last_page':last_page,'now_page':now_page,
            'worksWait':worksWait,'designer.worksOn':worksOn,'designer.worksNot':worksNot,'designer.worksSuc':worksSuc
              }
    return HttpResponse(json.dumps(conf))


def designer_works(request):
    user = 1#request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    unexecute_list = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 0)
    return_list = good_filter.unpublish_exec(unexecute_list)
    worksWait = unexecute_list.count()
    worksOn = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 1).count()
    worksNot = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 2).count()
    worksSuc = Goods.objects.filter(designer_id=designer.id,is_active=1).count()
    conf = {
            'worksWait':worksWait,'worksOn':worksOn,'worksNot':worksNot,'worksSuc':worksSuc,
            'name':designer.designername,'img':str(website.file_server_path)+str(designer.img)
              }
    return render(request, website.works_execute, conf)

def unexecute_delete(request):
    '''
        #在未审核页面直接删除作品 ;在已发布页面点击编辑后，点击取消发布；
    '''
    ids = request.POST['id']
    state = int(request.POST['state'])
    if state<4:
        Goods_Upload.objects.filter(id = ids).delete()
    else:
        Goods.objects.filter(id = ids).update(is_active=0)
    conf = {'status':"success"}
    return HttpResponse(json.dumps(conf))


'''def unexecute_edit(request):
    
    #在未审核页面 点击处理并提交 后往JS传得值
    
    id = 40#request.POST['id'] 
    goods_list = Goods_Upload.objects.filter(id = id)
    return_good = []
    for good in goods_list:
        temp = {'id':good.id,
                'name':good.goods_name,
                'file_size':good.file_size,
                'upload_time':good.upload_time.strftime("%Y-%m-%d"),
                'stl_path':str(good.stl_path)
                  }
        return_good.append(temp)
    conf = {'good':return_good}  
    return HttpResponse(json.dumps(conf))  '''


def edit_submit(request):
    '''
    #未审核页面，点击处理并提交 的处理表单；同时也是 未通过，点击重生申请发布的 处理表单
    '''
    file_id = request.POST['modify_id']
    count = 1
    p_url = []
    good = Goods_Upload.objects.get(id=file_id)
    stl_md5 = good.stl_path.encode('utf-8')
    print stl_md5
    stl_md5 = stl_md5.split('.')
    stl_md5 = stl_md5[0]
    stl_md5 = stl_md5.split('/')[0]
    price = request.POST['stl_price']
    previews = request.FILES
    describe = request.POST['stl_describe']
    name = request.POST['stl_name']
    if not name:
        name = good.goods_name
    
    for preview in previews:
        count = int(preview)
        preview_type=str(previews[preview])
        preview_type=preview_type.split('.')
        preview_md5 = photo_save(previews[preview],preview_type[0],preview_type[1],stl_md5)
        p1_url = str(stl_md5) + '/' + str(preview_type[0]) + '.' + str(preview_type[1])
        #p_url.append(p1_url)
        if count == 1:
            s=Goods_Upload.objects.filter(id= file_id).update(preview_1 = p1_url)
        if count == 2:
            s=Goods_Upload.objects.filter(id= file_id).update(preview_2 = p1_url)
        if count == 3:
            s=Goods_Upload.objects.filter(id= file_id).update(preview_3 = p1_url)
    s=Goods_Upload.objects.filter(id= file_id).update(goods_name=name,
                        goods_price = int(price),
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


def deletePic(request):
    this_id = request.POST['id']
    picid = int(request.POST['picId'])
    print picid
    good = Goods_Upload.objects.filter(id = this_id)
    if picid == 0:
        delpic = good.update(preview_1='null')
    if picid == 1:
        delpic = good.update(preview_2='null')
    if picid == 2:
        delpic = good.update(preview_3='null')
    conf = {'status':'success'}
    return HttpResponse(json.dumps(conf))

def photo_save(model,name,stl_type,stl_md5):
    chunks = ""
    for chunk in model.chunks():
        chunks += chunk
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
    http_url = website.file_server_imgupload#'http://192.168.1.101:8888/file/imgupload'
    http_body = '\r\n'.join(data)
    req = urllib2.Request(http_url, data=http_body)
    req.add_header('Content-Type', 'multipart/form-data; boundary=%s' % boundary)
    req.add_header('User-Agent','Mozilla/5.0')
    req.add_header('Referer','%s'%website.file_server_ip)#'http://192.168.1.101:8888/')
    resp = urllib2.urlopen(req, timeout=2545)
    qrcont=resp.read()
    md = json.loads(qrcont)
    print md
    md5 = md['status']
    print md5
    return md5


def auditing(request):
    '''
    #显示 审核中 页面
    '''
    #user = request.user
    user = 1#request.user
    now_page = int(request.POST['page']) - 1    
    designer = Designer_User.objects.get(user_id=1)#user.id)
    designer.icon = str(website.file_server_imgupload) + str(designer.img)
    unexecute_list = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 1)
    return_list = good_filter.unpublish_exec(unexecute_list)
    all_len = len(unexecute_list)
    total_pages = all_len/(website.auditing_one)+1
    last_page = all_len%(website.auditing_one)
    return_list = return_list[now_page*(website.auditing_one):(now_page+1)*(website.auditing_one)]
    conf = {'all_list':return_list,
            'icon' : designer.icon,
            'name':designer.designername,'total_pages':total_pages,'last_page':last_page,'now_page':now_page,
              }
    return HttpResponse(json.dumps(conf))


def not_passed(request):
    '''
    #显示 未通过 页面
    '''
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    now_page = int(request.POST['page']) - 1
    design_list = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 2)
    return_list = good_filter.unpublish_exec(design_list)
    all_len = len(return_list)
    total_pages = all_len/(website.unpassed_one)
    if all_len%(website.unpassed_one) !=0:
        total_pages += 1
    return_list = return_list[now_page*(website.unpassed_one):(now_page+1)*(website.unpassed_one)]
    conf = {'all_list':return_list,'total_pages':total_pages,'now_page':now_page,
              }
    return HttpResponse(json.dumps(conf))


'''#未通过页面，点击 重新申请发布 后的反馈操作
def photo_not_passed(request):#未通过页面，点击重新申请发布
    id = 56#request.POST['id']
    design_list = Goods_Upload.objects.filter(id=id)
    return_list = good_filter.unpublish_exec(design_list)
    conf = {'return_list':return_list}
    return HttpResponse(json.dumps(conf))'''


def has_published(request):
    '''
    #显示已发布页面
    '''
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    now_page = int(request.POST['page']) - 1
    design_list = Goods.objects.filter(designer_id=designer.id,is_active=1)
    return_list = good_filter.publish_exec(design_list)
    all_len = len(return_list)
    total_pages = all_len/(website.publish_one)
    if all_len%(website.publish_one) !=0:
        total_pages += 1
    return_list = return_list[now_page*(website.publish_one):(now_page+1)*(website.publish_one)]
    conf = {'all_list':return_list,'total_pages':total_pages
            }
    return HttpResponse(json.dumps(conf))


def published_edit(request):
    '''
    #在已发布页面点击编辑后，传的值
    '''
    id = request.POST['id']
    design_list = Goods.objects.filter(id=id)
    return_list = good_filter.publish_exec(design_list)
    conf = {'photo':return_list}
    return HttpResponse(json.dumps(conf))


def published_submit(request):
    '''
    #在已发布页面点击编辑后，修改后提交的值
    '''
    file_id = request.POST['id']
    photo = Goods.objects.filter(id=file_id)
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


def dwon_stl(request):
    '''
    #预览STL文件 进行下载步骤
    '''
    _url = request.POST['_url']
    stl_path = good_filter.down_stl(_url)
    context = {'stl_path':stl_path}
    return HttpResponse(json.dumps(context))

