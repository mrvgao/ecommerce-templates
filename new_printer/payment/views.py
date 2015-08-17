# -*- coding:UTF-8 -*-

from django.shortcuts import render
from django.http import Http404, HttpResponse
from django.contrib.auth.decorators import login_required
from django.db import transaction

from configuration.models import Bills, Goods, Goods_Bills, Vender_Goods
from utility.BillsHandler import BillsManager
from utility.Payment import Alipay, Tenpay

import json

# Create your views here.

@login_required
@transaction.atomic
def build_bills(request):
    '''
    descriptions:生成订单
    params: user,goods_list<id>
    return:
    '''
    if request.method == 'GET':
        bm = BillsManager()
        user = request.user
        goods_list = [1]
        bill_id = bm.random_bill()
        conf = {}
        vender_user = bm.authtovender(user)
        if vender_user is not None:
            bills = bm.addtobill(bill_id, vender_user, goods_list)
            if(bills is not None):
                result = bm.addtogoodsbill(bills,goods_list)
                delc = bm.delcart(vender_user, goods_list)
                if(delc): 
                    conf = {'status': result}
                else:
                    conf = {'status':'FAILURE'}
        return HttpResponse(json.dumps(conf))
    else:
        raise Http404


@login_required
def list_bills(request):
    '''
    description:订单列表
    params:user
    return:
    '''
    if request.method == 'GET':
        bm = BillsManager()
        user = request.user
        vender_user = bm.authtovender(user)
        try:
            bills = Bills.objects.filter(vender=vender_user,bill_status='init')
            for b in bills:
                bills_id = b.id
        except Exception as e:
            conf = {'status':'bill is not build at before'}
        goods_bills = Goods_Bills.objects.filter(bills_id=bills_id)
        if len(goods_bills) == 0:
            conf = {'status':'bill is null'}
        else:
            for gb in goods_bills:
                gb.goods
            conf = {'goods_bills':goods_bills}
        return HttpResponse(json.dumps(conf))#render(request, website.index, conf)
    else:
        raise Http404


@login_required
def add_cart(request):
    '''
    description:添加到购物车
    params:
    return:
    '''
    if request.method == 'GET':
        bm = BillsManager()
        user = request.user
        goods_id = '3'   
        conf = {}
        vender_user = bm.authtovender(user)
        try:
            goods = Goods.objects.get(id=goods_id)
        except Exception as e:
            conf = {'status':'add to cart error'}
        vg = Vender_Goods.objects.filter(goods=goods,vender=vender_user).exists()
        if (vg):
            vender_goods = Vender_Goods(is_buy=True,buy_time=bm.now_time())
        else:
            vender_goods = Vender_Goods(goods=goods,
                    vender=vender_user,
                    is_buy=True,
                    buy_time=bm.now_time())
        vender_goods.save()
        conf = {'goods',goods}
        return HttpResponse(json.dumps(conf))#render(request, website.index, conf)
    else:
        raise Http404


@login_required
def list_cart(request):
    '''
    description:购物车列表
    params: user
    return:
    '''
    if request.method == 'GET':
        bm = BillsManager()
        user = request.user
        conf = {}
        vender_user = bm.authtovender(user)
        vender_goods = Vender_Goods.objects.filter(is_buy=True, vender=vender_user)
        if len(vender_goods) == 0:
            conf = {'status':'cart is null'}
        else:
            for cart in vender_goods:
                cart.goods
            conf = {'vender_goods':vender_goods}
        return HttpResponse(json.dumps(conf)) #render(request, website.index, conf)
    else:
        raise Http404


@login_required
def del_cart(request):
    '''
    description:删除购物车
    params: user, goods_list<id>
    return:
    '''
    if request.method == 'GET':
        bm = BillsManager()
        user = request.user
        goods_list = [1,2]
        conf = {}
        vender_user = bm.authtovender(user)
        if vender_user is not None:
            delc = bm.delcart(vender_user, goods_list)
            if (delc):
                conf = {'status':'SUCCESS'}
            else:
                conf = {'status':'FAILURE'}
        return HttpResponse(json.dumps(conf))
    else:
        raise Http404


def pay(request):
    '''
    description:支付
    params: pay_way, bills_id
    return:
    '''
    if request.method == 'GET':
        ali = Alipay()
        ten = Tenpay()
        pay_way = 'alipay'
        bills_id = '10'
        bills = Bills.objects.filter(id=bills_id)
        for b in bills:
            bill = b.bill
            subject = b.subject
            body = b.bill_body
            total_fee = b.total_fee
        if pay_way == 'alipay':
            url = ali.create_direct_pay_by_user(bill, subject, body, total_fee)
        elif pay_way == 'tenpay':
            url = ten.create_direct_pay_by_user(bill, subject, body, total_fee)
        else:
            return HttpResponse('please choose a way to pay')
        return HttpResponse(json.dumps({'state': url}))
        
