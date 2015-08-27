# -*- coding: UTF-8 -*-

from django.conf.urls import patterns, url
from account import views

urlpatterns = patterns('',
    #验证手机号是否存在
    url(r'^check_phone', views.check_phone, name='check_phone'),
    #发送验证信息
    url(r'^send_verify_message', views.send_verify_message, name='send_verify_message'),
    #内测申请
    url(r'^beta_apply', views.beta_apply, name='beta_apply'),
    #验证用户名
    url(r'^check_username', views.check_username, name='check_username'),
    #验证邀请码
    url(r'^check_code', views.check_code, name='check_code'),
    #用户注册
    url(r'^u_register', views.u_register, name='u_register'),
    #用户登录
    url(r'^u_login', views.u_login, name='u_login'),
    #忘记密码
    url(r'^u_forgetpwd', views.u_forgetpwd, name='u_forgetpwd'),
    #修改密码
    url(r'^u_resetpwd', views.u_resetpwd, name='u_resetpwd'),
    #用户注销
    url(r'^u_logout', views.u_logout, name='u_logout'),
    #修改绑定手机
    url(r'^u_change_phone', views.u_change_phone, name='u_change_phone'),
    #修改用户名
    url(r'^u_change_username', views.u_change_username, name='u_change_username'),
    #修改支付方式
    url(r'^u_alipay', views.u_alipay, name='u_alipay'),
    #修改头像
    url(r'^u_img', views.u_img, name='u_img'),

)
