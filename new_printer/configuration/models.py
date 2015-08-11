#-*- coding:UTF-8 -*-

from django.db import models
from django.contrib.auth.models import User


class Designer_User(models.Model):
    '''
    设计师
    '''
    #扩展user表
    user = models.OneToOneField(User)
    #手机号
    phone = models.CharField(max_length=15)
    #用户名
    designername = models.CharField(max_length=30, default=None, blank=True)
    #头像
    img = models.ImageField(blank=True)
    #被关注次数
    marked_count = models.IntegerField(default=0, blank=True)
    #绑定支付宝账号
    alipay = models.CharField(max_length=50)
    #头像
    img = models.ImageField(blank=True)
    

class Vender_User(models.Model):
    '''
    商家
    '''
    #扩展user表
    user = models.OneToOneField(User)
    #手机号
    phone = models.CharField(max_length=15)
    #用户名
    vendername = models.CharField(max_length=30, default=None, blank=True) 
    #头像
    img = models.ImageField(blank=True)
    #建立Vender,Designer关联表
    designer = models.ManyToManyField(Designer_User,through='Vender_Designer', blank=True)
    

class Vender_Designer(models.Model):
    '''
    关注
    '''
    designer = models.ForeignKey(Designer_User)
    vender = models.ForeignKey(Vender_User)
    #关注时间
    marked_date = models.DateTimeField(auto_now_add=True)


class Goods_Upload(models.Model):
    '''
    商品上传，未审核
    '''
    #商品名
    goods_name = models.CharField(max_length=50)
    #设计师
    designer = models.ForeignKey(Designer_User)
    #价格
    goods_price = models.FloatField(default=0.0)
    #描述
    description = models.TextField()
    #标签
    tags = models.CharField(max_length=255)
    #类型
    style = models.CharField(max_length=255, default='', blank=True)
    #stl文件
    stl_path = models.FileField(blank=True)
    #预览图
    preview_1 = models.ImageField()
    preview_2 = models.ImageField()
    preview_3 = models.ImageField()
    #zip
    zip_path = models.FileField(blank=True)
    #Jcad
    jcad_path = models.FileField(blank=True)
    #上传时间
    upload_time = models.DateTimeField(auto_now_add=True)


class Goods(models.Model):
    '''
    审核通过商品
    '''
    #商品名
    goods_name = models.CharField(max_length=50)
    #设计师
    designer = models.ForeignKey(Designer_User)
    #价格
    goods_price = models.FloatField(default=0.0)
    #描述
    description = models.TextField()
    #收藏次数
    collected_count = models.IntegerField(default=0, blank=True)
    #下载次数
    download_count = models.IntegerField(default=0, blank=True)
    #标签
    tags = models.CharField(max_length=255)
    #类型
    style = models.CharField(max_length=255, default='', blank=True)
    #stl文件
    stl_path = models.FileField(blank=True)
    #预览图
    preview_1 = models.ImageField()
    preview_2 = models.ImageField()
    preview_3 = models.ImageField()
    #zip
    zip_path = models.FileField(blank=True)
    #Jcad
    jcad_path = models.FileField(blank=True)
    #审批通过时间
    approval_time = models.DateTimeField(auto_now_add=True)
    #关联 收藏\下载\购买
    vender = models.ManyToManyField(Vender_User,through='Vender_Goods', blank=True)

class Vender_Goods(models.Model):
    '''
    收藏-下载-购买（商家用户对应商品）
    '''
    vender = models.ForeignKey(Vender_User)
    goods = models.ForeignKey(Goods)
    #是否收藏
    is_collected = models.BooleanField(default=False)
    #收藏时间
    collected_time = models.DateTimeField(blank=True)
    #是否下载
    is_download = models.BooleanField(default=False)
    #下载时间
    download_time = models.DateTimeField(blank=True)
    #是否加入购物车
    is_buy = models.BooleanField(default=False)
    #加入购物车时间
    buy_time = models.DateTimeField(blank=True)


class Bills(models.Model):
    '''
    订单表
    '''
    #订单号
    bill = models.CharField(max_length=30)
    #订单名称
    subject = models.CharField(max_length=500)
    #订单描述
    bill_body = models.CharField(max_length=2000)
    #订单总额
    total_fee = models.FloatField(default=0.0)
    #交易状态
    trade_status = models.CharField(max_length=50, default='INIT', null=True)
    #订单状态
    bill_status = models.CharField(max_length=4)
    #买家
    vender = models.ForeignKey(Vender_User)
    #订单生成日期
    bill_time = models.DateTimeField(auto_now_add=True)
    #
    goods = models.ManyToManyField(Goods,through='Goods_Bills', blank=True)

class Goods_Bills(models.Model):
    '''
    商品订单表
    '''
    goods = models.ForeignKey(Goods)
    bills = models.ForeignKey(Bills)
    #订单日期
    bills_time = models.DateTimeField(auto_now_add=True)


class BetaApply(models.Model):
    '''
    内测申请表
    '''
    #手机号
    phone = models.CharField(max_length=15)
    #邀请码
    InvitationCode = models.CharField(max_length=15)
    #申请身份
    identity = models.CharField(max_length=15)
    #申请日期
    apply_time = models.DateTimeField(auto_now_add=True)
