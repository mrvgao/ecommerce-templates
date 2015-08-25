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

unexec_one = 2 #
auditing_one = 2#
unpassed_one = 2#
publish_one = 2#

def index(request):
    return render(request, website.index)

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
                                         stl_path = str(jwary_md5[md5]) + '/' + str(stl_url),
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
    #pdb.set_trace()
    if request.method == 'POST':
        a_have = True
        stls = request.FILES.getlist('jiezhi')
        file_hased = []
        count = 0
        if stls:
            existed = stls_save(stls)
            if existed:
                for i in existed:
                    conf = {'hased':i}
                    file_hased.append(conf)
        return HttpResponse(json.dumps(file_hased))
    else:
        return render(request, website.upfile)


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
    http_url = website.file_server_upload#'http://192.168.1.104:8888/file/upload'
    http_body = '\r\n'.join(data)
    req = urllib2.Request(http_url, data=http_body)
    req.add_header('Content-Type', 'multipart/form-data; boundary=%s' % boundary)
    req.add_header('User-Agent','Mozilla/5.0')
    req.add_header('Referer','%s'%website.file_server_ip)#'http://192.168.1.101:8888/')
    resp = urllib2.urlopen(req, timeout=10)
    '''while not resp:
        if count > 100:
            status = 'upload_time_out!'
        else:
            time.sleep(1)
            count = count + 1'''
    #print "resp",resp
    qrcont=resp.read()
    md = json.loads(qrcont)
    md5 = md['status']
    return md5

#上传STL文件处的删除操作
def stl_delete(request):
    del_id = request.POST['id']
    Goods_Upload.objects.filter(id = del_id).delete()
    conf = {'status':'success'}
    return HttpResponse(json.dumps(conf)) 

#设计师作品管理，显示 未审核 页面  #商品状态，0：只有STl,未处理；1：审核中； 2：未通过 3:审核通过， 新加
def workd_unexecute(request):
    #pdb.set_trace()
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
    total_pages = all_len/unexec_one+1
    last_page = all_len%unexec_one
    return_list = return_list[now_page*unexec_one:(now_page+1)*unexec_one]
    conf = {'all_list':return_list,
            'icon' : designer.icon,
            'name':designer.designername,'total_pages':total_pages,'last_page':last_page,'now_page':now_page,
            'worksWait':worksWait,'designer.worksOn':worksOn,'designer.worksNot':worksNot,'designer.worksSuc':worksSuc
              }
    #return render(request, website.works_execute, conf)
    return HttpResponse(json.dumps(conf))


def designer_works(request):
    user = 1#request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    unexecute_list = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 0)
    return_list = good_filter.unpublish_exec(unexecute_list)
    worksWait = unexecute_list.count()
    worksOn = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 1).count()
    worksNot = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 2).count()
    worksSuc = Goods.objects.filter(designer_id=designer.id).count()
    conf = {
            'worksWait':worksWait,'worksOn':worksOn,'worksNot':worksNot,'worksSuc':worksSuc
              }
    return render(request, website.works_execute, conf)
#在未审核页面直接删除作品
def unexecute_delete(request):
    ids = request.POST['id']
    Goods_Upload.objects.filter(id = ids).delete()
    conf = {'status':"success"}
    return HttpResponse(json.dumps(conf))

#在未审核页面 点击处理并提交 后往JS传得值
def unexecute_edit(request):
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
    return HttpResponse(json.dumps(conf))  

#未审核页面，点击处理并提交 的处理表单；同时也是 未通过，点击重生申请发布的 处理表单
def edit_submit(request):
    #file_id = request.POST['id']
    file_id = 44
    count = 1
    p_url = []
    #pdb.set_trace()
    good = Goods_Upload.objects.get(id=file_id)
    stl_md5 = good.stl_path
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


#显示 审核中 页面
def auditing(request):
    #user = request.user
    user = 1#request.user
    now_page = int(request.POST['page']) - 1    
    designer = Designer_User.objects.get(user_id=1)#user.id)
    designer.icon = str(website.file_server_imgupload) + str(designer.img)
    unexecute_list = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 1)
    return_list = good_filter.unpublish_exec(unexecute_list)
    all_len = len(unexecute_list)
    total_pages = all_len/unexec_one+1
    last_page = all_len%unexec_one
    return_list = return_list[now_page*unexec_one:(now_page+1)*unexec_one]
    conf = {'all_list':return_list,
            'icon' : designer.icon,
            'name':designer.designername,'total_pages':total_pages,'last_page':last_page,'now_page':now_page,
              }
    return HttpResponse(json.dumps(conf))
    #return render(request, website.works_execute, conf)

#显示 未通过 页面
def not_passed(request):
    #user = request.user
    designer = Designer_User.objects.get(user_id=1)#user.id)
    design_list = Goods_Upload.objects.filter(designer_id=designer.id,good_state = 2)
    return_list = good_filter.unpublish_exec(design_list)
    conf = {'all_list':return_list
              }
    return HttpResponse(json.dumps(conf))


#未通过页面，点击 重新申请发布 后的反馈操作
def photo_not_passed(request):#未通过页面，点击重新申请发布
    id = 56#request.POST['id']
    design_list = Goods_Upload.objects.filter(id=id)
    return_list = good_filter.unpublish_exec(design_list)
    conf = {'return_list':return_list}
    return HttpResponse(json.dumps(conf))


#显示已发布页面
def has_published(request):
    #user = request.user
    #pdb.set_trace()
    designer = Designer_User.objects.get(user_id=1)#user.id)
    design_list = Goods.objects.filter(designer_id=designer.id)
    return_list = good_filter.publish_exec(design_list)
    '''for good in goods:
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
        goods_all.append(this_good)'''               
    conf = {'all_list':return_list
            }
    return HttpResponse(json.dumps(conf))

#在已发布页面点击编辑后，传的值
def published_edit(request):
    id = request.POST['id']
    design_list = Goods.objects.filter(id=id)
    return_list = good_filter.publish_exec(design_list)
    conf = {'photo':return_list}
    return HttpResponse(json.dumps(conf))

#在已发布页面点击编辑后，修改后提交的值
def published_submit(request):
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

def published_delete(request):#在已发布页面点击编辑后，点击删除
    del_id = request.POST['id']
    for id in ids:
        Goods.objects.filter(id = id).update(is_active=0)
    if delete:
        conf = {'status':"success"}
    else:
        conf = {'status':'eror'}
    return HttpResponse(json.dumps(conf))

#预览STL文件 进行下载步骤
def dwon_stl(request):
    _url = request.POST['_url']
    stl_path = good_filter.down_stl(_url)
    context = {'stl_path':stl_path}
    return HttpResponse(json.dumps(context))

