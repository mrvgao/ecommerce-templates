# -*- coding:UTF-8 -*-

from django.shortcuts import render
from django.http import Http404, HttpResponse
from django.contrib.auth.decorators import login_required
from django.db import transaction

from configuration.models import Bills, Goods, Vender_User, Goods_Bills, Vender_Goods
from utility.BillsHandler import BillsManager, now_time

import json

# Create your views here.

@login_required
@transaction.atomic
def build_bills(request):
    '''
    descriptions:生成订单
    params:
    return:
    '''
    if request.method == 'GET':
        bill_id = BillsManager().random_bill()
        user = request.user
        goods_id = '1'
        date = now_time()
        conf = {}
        is_bill_exist = BillsManager().is_bill_exist(bill_id)
        if(is_bill_exist):
            conf = {'status':'bill is existed'} 
        else:
            bills = Bills(bill = bill_id,
                    subject = goods.goods_name, 
                    bill_body = goods.description, 
                    total_fee = goods.goods_price, 
                    trade_status = 'INIT', 
                    bill_status = 'init', 
                    bill_time = date, 
                    vender = vender_user)
            bills.save()
            goods_bills = Goods_Bills(
                    bills = bills,
                    goods = goods,
                    bills_time = date)
            goods_bills.save()
            conf = {'status':'SUCCESS'}
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
        user = request.user
        try:
            vender_user = Vender_User.objects.get(user=user)
            bills = Bills.objects.get(vender=vender_user,bill_status='init')
        except Exception as e:
            return 'bill is not build at before'
        goods_bills = Goods_Bills.objects.filter(bills=bills)
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
        user = request.user
        goods_id = '1'   
        conf = {}
        try:
            vender_user = Vender_User.objects.get(user=user)
            goods = Goods.objects.get(id=goods_id)
        except Exception as e:
            conf = {'status':'add to cart error'}
        vg = Vender_Goods.objects.filter(goods=goods,vender=vender_user).exists()
        if (vg):
            vender_goods = Vender_Goods(is_buy='y',buy_time=now_time())
        else:
            vender_goods = Vender_Goods(goods=goods,
                    vender=vender_user,
                    is_buy='y',
                    buy_time=now_time())
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
        user = request.user
        vender_user = Vender_User.objects.get(user=user)
        conf = {}
        vender_goods = Vender_Goods.objects.filter(is_buy='y', vender=vender_user)
        if vender_goods.length == 0:
            conf = {'status':'cart is null'}
        else:
            for cart in vender_goods:
                cart.goods
            conf = {'vender_goods':vender_goods}
        return HttpResponse(json.dumps(conf)) #render(request, website.index, conf)


@login_required
def del_cart(request):
    '''
    description:删除购物车
    params:
    return:
    '''




def pay(request):
    '''
    description:支付
    params: gb.bills.id, price,
    return:
    '''

    

