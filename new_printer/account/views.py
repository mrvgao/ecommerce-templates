# -*- coding: UTF-8 -*-

from django.shortcuts import render
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required

from configuration.models import BetaApply, Designer_User, Vender_User 
from utils.AccountHandler import Verification, UserManager
from conf import config 

import json
import urllib, urllib2
import re
import time
from django import forms

# Create your views here.

def check_phone(request):
    '''
    description:验证手机号是否能注册
    params:phone
    return:SUCCESS
    '''
    if request.method == 'POST':
        phone = request.POST.get('phone')
        result = Verification().is_phone_exist(phone)
        if(result):
            conf = {'status':'TRUE'}
        else:
            conf = {'status':'FALSE'} 
        return HttpResponse(json.dumps(conf))
    else:
        raise Http404


def send_verify_message(request):
    '''
    description:发送验证短信
    params:phone
    return:SUCCESS
    '''
    if request.method == 'GET':
        phone = '15957440169'
        verification_code = Verification().ramdon_dig(phone)
        request.session['phone_verify'] = '224662'#verification_code
        request.session['phone_number'] = phone
        
        verification_string = u'您的验证码是【%s】。请不要把验证码泄露给其他人。如非本人操作，可不用理会！' % verification_code
        print verification_code 
        verify_data = {'account': config.ACCOUNT,
                'password': config.PASSWORD,
                'mobile': phone,
                'content': verification_string.encode("utf-8")
                }
        conf = {}
        try:
            verify_data_urlencode = urllib.urlencode(verify_data)
            req = urllib2.Request(url=config.VERIFY_PHONE_URL, data=verify_data_urlencode)
            res_data = urllib2.urlopen(req)
            res = res_data.read()
            rer = re.compile(r'(?<=<code>)(.+?)(?=</code>)').search(res)
            if rer.group(0) == '2': 
                conf = {'status': 'SUCCESS'}
            else:
                conf = {'status': 'SEND AGAIN'}
        except Exception as e:
            conf = {'status': 'FAILURE'}
        return HttpResponse(json.dumps(conf))
    else:
        raise Http404


def beta_apply(request):
    '''
    description:内测申请
    params: phone,verification_code,identity,
    return: SUCCESS
    '''
    if request.method == 'GET':
        phone = '15957440169'
        verification_code = '224662'
        identity = 'V'
        session_verification_code = request.session['phone_verify']
        session_phone = request.session['phone_number']
        ISOTIMEFORMAT='%Y-%m-%d %X'
        date = time.strftime(ISOTIMEFORMAT, time.localtime())
        conf = {}
        if verification_code == session_verification_code:
            beta = BetaApply(phone=phone, InvitationCode='0811', 
                    identity = identity, apply_time = date)
            beta.save()
            conf = {'status':'SUCCESS'}
        else:
            conf = {'status':'FAILURE'}
        del request.session['phone_verify']
        del request.session['phone_number']
        return HttpResponse(json.dumps(conf))
    else:
        raise Http404

def check_username(request):
    '''
    description:验证用户名是否存在
    params:
    return:
    '''
    if request.method == 'GET':
        username = 'test'
        conf = {}
        vu = Vender_User.objects.filter(vendername = username).exists()
        if (vu):
            conf = {'status':'TRUE'}
        else:
            du = Desinger_User.objects.filter(designername = username).exists()
            if(du):
                conf = {'status':'TRUE'}
            else:
                conf = {'status':'FALSE'}
        return HttpResponse(json.dumps(conf))


def check_code(request):
    '''
    description:验证邀请码
    params:phone,code
    return: SUCCESS
    '''
    if request.method == 'GET':
        #phone = '15957440169'
        code = '0321'
        #request.session['phone_register'] = phone
        result = Verification().isright_InvitationCode(code)
        conf = {}
        if (result == 'FALSE'):
            conf = {'status':'FAILURE'}
        else:
            conf = {'status':'TRUE'}
        return HttpResponse(json.dumps(conf))


def u_register(request):
    '''
    description:用户注册
    params:username,password,   phone
    '''
    if request.method == 'GET':
        username = 'www'
        password = '111'
        phone = request.session['phone_register']
        code = '0321'
        identity = Verification().isright_InvitationCode(code)
        conf = {}
        result = UserManager().user_register(phone, password, username, identity)
        conf = {'status':result}
        del request.session['phone_register']
        return HttpResponse(json.dumps(conf))
    else:
        raise Http404


def u_login(request):
    '''
    description:用户登录
    params: phone or username, password
    return:
    '''
    if request.method == 'POST':
        username = request.POST.get('phone')
        password = request.POST.get('password')
        conf = {}
        try:
            u = authenticate(username=username, password=password)
            if u.is_active:
                login(request, u)
                identity = UserManager().user_which(u)
                if identity =='D':
                    conf = {'status':'D'}
                elif identity =='V':
                    conf = {'status':'V'}
                else:
                    conf = {'status':'None'}
        except Exception as e:
            conf = {'status':'FAILURE'}
        return HttpResponseRedirect('/shop/home')
    else:
        raise Http404


def u_forgetpwd(request):
    '''
    desctiption:忘记密码,验证身份
    params: phone, verification_code
    return: SUCCESS
    '''
    if request.method == 'GET':
        phone = '' 
        verification_code = ''
        session_verification_code = request.session['phone_verify']
        conf = {}
        if verification_code == session_verification_code:
            conf = {'status':'SUCCESS'}
        else:
            conf = {'status':'FAILURE'}
        del request.session['phone_verify']
        return HttpResponse(json.dumps(conf))
    else:
        raise Http404


def u_resetpwd(request):
    '''
    description:设置新密码
    params: phone
    return:
    '''
    if request.method == 'GET':
        password = '111111'
        session_phone = '15957440169'#request.session['phone_number']
        conf = {} 
        result = UserManager().user_reset_pwd(session_phone,password)
        #重置密码成功
        if result == 'SUCCESS':
            #登录
            u = authenticate(username=session_phone, password=password)
            if u.is_active:
                login(request, u)
                identity = UserManager().user_which(u)
                if identity == 'D':
                    conf = {'status':'D'}
                elif identity == 'V':
                    conf = {'status':'V'}
                else:
                    conf = {'status':'None'}
            else:
                conf = {'status':'login error'}
        else:
            conf = {'status':'reset password error'}
        return HttpResponse(json.dumps(conf))

    else:
        raise Http404


@login_required
def u_logout(request):
    '''
    description:用户注销
    params:
    return: SUCCESS
    '''
    logout(request)
    conf = {'status':'SUCCESS'}
    return HttpResponse(json.dumps(conf))


@login_required
def u_change_phone(request):
    '''
    description:修改绑定手机
    params:user, phone
    return:SUCCESS
    '''
    if request.method == 'GET':
        phone = ''
        user = request.user
        result = UserManager().user_change_phone(user, phone)
        conf = {}
        if (result):
            identity = UserManager().user_which(user)
            if identity == 'D':
                d = Designer_User.objects.filter(user=user).update(phone=phone)
                conf = {'status':'SUCCESS'} 
            elif identity == 'V':
                v = Vender_User.objects.filter(user=user).update(phone=phone)
                conf = {'status':'SUCCESS'}
            else:
                conf = {'status':'xx_user failure'}
        else:
            conf = {'status':'auth_user failure'}
        return HttpResponse(json.dumps(conf))
    else:
        raise Http404

@login_required 
def u_change_username(request):
    '''
    description:修改用户名
    params: user, username
    return:
    '''
    if request.method == 'GET':
        username = 'testwangjh'
        user = request.user
        conf = {}
        identity = UserManager().user_which(user)
        if identity == 'D':
            d = Designer_User.objects.filter(user=user).update(designername=username)
            conf = {'status':'SUCCESS'}
        elif identity == 'V':
            v = Vender_User.objects.filter(user=user).update(vendername=username)
            conf = {'status':'SUCCESS'}
        else:
            conf = {'status':'FAILURE'}
        return HttpResponse(json.dumps(conf))
    else:   
        raise Http404

@login_required
def u_alipay(request):
    '''
    description:操作支付宝账号
    params:
    return:
    '''
    if request.method == 'GET':
        alipay = '152@qc'
        user = request.user
        conf = {}
        d = Designer_User.objects.filter(user=user).update(alipay=alipay)
        if d>=1:
            conf = {'status':alipay}
        else:
            conf = {'status':'FAILURE'}
        return HttpResponse(json.dumps(conf))
    else:
        raise Http404


class ImgForm(forms.Form):
    '''
    description:头像表单
    params:
    return:
    '''
    img_name = forms.CharField(max_length=100)
    img_up = forms.FileField()

@login_required
def u_img(request):
    '''
    description:操作头像
    params:
    return:
    '''
    if request.method == 'GET':
        conf = {}
        user = request.user
        img = ImgForm(request.POST, request.FILES)
        if img.is_valid():
            img_name = photo.cleaned_data['img_name']
            img_up = request.FILES['img_up']
            file_type = str(img_up).split('.')
            md5 = file_save(img_up, img_name, file_type[1])

            img_url ='img/' + str(stl_md5)+ '.' +str(stl_type[1])  
            identity = UserManager().user_which(user)
            if identity == 'D':
                d = Designer_User.objects.filter(user=user).update(img=img_url)
                conf = {'status':img_url}
            elif identity == 'V':
                v = Vender_User.objects.filter(user=user).update(img=img_url)
                conf = {'status':img_url}
            else:
                conf = {'status':'FAILURE'}
            return HttpResponse(json.dumps(conf))
