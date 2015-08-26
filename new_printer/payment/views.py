# -*- coding:UTF-8 -*-

from django.shortcuts import render
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt

from configuration.models import Bills, Goods, Goods_Bills, Vender_Goods
from utils.BillsHandler import BillsManager
from utils import alipay, tenpay


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
    if request.method == 'POST':
        bm = BillsManager()
        user = request.user
        goods_list = request.POST.getlist('goods_list[]')
        where = request.POST.get('where')
        bill_id = bm.random_bill()
        conf = {}
        vender_user = bm.authtovender(user)
        if vender_user is not None:
            bills = bm.addtobill(bill_id, vender_user, goods_list, where)
            if(bills is not None):
                result = bm.addtogoodsbill(bills,goods_list)
                #delc = bm.delcart(vender_user, goods_list)
                #if(delc): 
                conf = {'status':'SUCCESS','bill_id':bills.id}
                #else:
                #    conf = {'status':'FAILURE'}
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
            goods_bills = Goods_Bills.objects.filter(bills_id=bills_id)
            if len(goods_bills) == 0:
                conf = {'status':'bill is null'}
            else:
                for gb in goods_bills:
                    gb.goods
                conf = {'goods_bills':goods_bills}
        except Exception as e:
            conf = {'status':'FAILURE'} 
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
    if request.method == 'POST':
        bm = BillsManager()
        user = request.user
        goods_id = request.POST.get('goods_id')
        conf = {}
        vender_user = bm.authtovender(user)
        try:
            goods = Goods.objects.get(id=goods_id)
            vg = Vender_Goods.objects.filter(goods=goods,vender=vender_user).exists()
            if (vg):
                v_g = Vender_Goods.objects.filter(goods=goods,vender=vender_user).update(is_cart=True,cart_time=bm.now_time())
            else:
                vender_goods = Vender_Goods(goods=goods,
                        vender=vender_user,
                        is_cart=True,
                        cart_time=bm.now_time())
                vender_goods.save()
            conf = {'status':'SUCCESS'}
        except Exception as e:
            conf = {'status':'FAILURE'}
        return HttpResponse(json.dumps(conf))
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
        vender_goods = Vender_Goods.objects.filter(is_cart=True, vender=vender_user)
        if len(vender_goods) == 0:
            conf = {'status':'cart is null'}
        else:
            for cart in vender_goods:
                cart.goods
            conf = {'vender_goods':vender_goods}
        return render(request, 'payment/cart.html', conf)
    else:
        raise Http404


@login_required
def del_cart(request):
    '''
    description:删除购物车
    params: user, goods_list<id>
    return:
    '''
    if request.method == 'POST':
        goods_id = request.POST.get('goods_id')
        bm = BillsManager()
        user = request.user
        goods_list = []
        goods_list.append(goods_id)
        conf = {}
        vender_user = bm.authtovender(user)
        if vender_user is not None:
            delc = bm.delcart(vender_user, goods_list)
            if (delc):
                vender_goods = Vender_Goods.objects.filter(is_cart=True, vender=vender_user)
                if len(vender_goods) == 0:
                    conf = {'status':'FALSE','cart_is_exist':'FALSE'}
                else:
                    conf = {'status':'TRUE','cart_is_exist':'TRUE'}
            else:
                conf = {'status':'FALSE','cart_is_exist':'TRUE'}
        return HttpResponse(json.dumps(conf))
    else:
        raise Http404


def pay(request):
    '''
    description:支付
    params: pay_way, bills_id
    return:
    '''
    if request.method == 'POST':
        pay_way = request.POST.get('pay_method')
        bills_id = request.POST.get('bills_id')
        bills = Bills.objects.filter(id=bills_id)
        for b in bills:
            bill = b.bill
            subject = b.subject
            body = b.bill_body
            total_fee = b.total_fee
        if pay_way == 'alipay':
            url = alipay.create_direct_pay_by_user(bill, subject, body, total_fee)
        elif pay_way == 'tenpay':
            ip = '123.158.36.208'
            url = tenpay.create_direct_tenpay_by_user(bill, subject, body, total_fee, ip)
        else:
            return HttpResponse('please choose a way to pay')
        return HttpResponse(json.dumps({'state': url}))

def pay_detail_return(bills):
    '''
    description:返回商品详情页
    params:
    return:
    '''
    bm = BillsManager()
    vender_user = bills.vender
    goods_bills = Goods_Bills.objects.filter(bills=bills)
    for gb in goods_bills:
        goods = gb.goods
    vg = Vender_Goods.objects.filter(goods=goods,vender=vender_user).exists()
    if(vg):
        v_g = Vender_Goods.objects.filter(goods=goods,vender=vender_user).update(is_buy=True,buy_time=bm.now_time())
    else:
        vender_goods = Vender_Goods(goods=goods,
            vender=vender_user,
            is_buy=True,
            buy_time=bm.now_time())
        vender_goods.save()        
    return goods

def pay_cart_return(bills):
    '''
    description:返回购物车页面
    params:
    return:
    '''
    bm = BillsManager()
    vender_user = bills.vender
    conf = {}
    goods_list = []
    vender_goods = Vender_Goods.objects.filter(is_cart=True, vender=vender_user)
    conf = {'vender_goods':vender_goods,'is_paied':True}
    for cart in vender_goods:
        goods_list.append(cart.goods.id)
    delc = bm.delcart(vender_user, goods_list)
    if delc:
        return conf
    else:
        return None

def ali_return_url(request):
    '''
    description:alipay 同步通知
    params:
    return:
    '''
    if alipay.ali_notify_verify(request.GET):
        tn = request.GET.get('out_trade_no')
        trade_status = request.GET.get('trade_status')
        if trade_status == 'TRADE_SUCCESS':
            bills = Bills.objects.get(bill=tn)
            bills.trade_status = trade_status
            bills.bill_status = 'down'
            bills.save()
            where = bills.where
            if where == 'cart':
                conf = pay_cart_return(bills)
                return render(request, 'payment/cart.html', conf)
            elif where == 'detail':
                goods = pay_detail_return(bills)
                return HttpResponseRedirect('/shop/goods-detail?goods_id=%s'%goods.id)
        else:
            return HttpResponse('pay fail')
    return HttpResponse('verify fail')


@csrf_exempt
def ali_notify_url(request):
    '''
    description:alipay异步通知
    params:
    return:
    '''
    if request.method == 'POST':
        if alipay.ali_notify_verify(request.POST):
            tn = request.POST.get('out_trade_no')
            trade_status = request.POST.get('trade_status')
            if trade_status == 'WAIT_SELLER_SEND_GOODS':
                bills = Bills.objects.get(bill=tn)
                bills.trade_status = trade_status
                bills.bill_status = 'down'
                bills.save()
                where = bills.where
                if where == 'cart':
                    conf = pay_cart_return(bills)
                elif where == 'detail':
                    goods = pay_detail_return(bills)
                return HttpResponse('success')
            else:
                return HttpResponse('success')
    return HttpResponse('fail')


def ten_return_url(request):
    '''
    description:tenpay同步通知
    params:
    return:
    '''
    if tenpay.ten_notify_verify(request.GET):
        tn = request.GET.get('out_trade_no')
        trade_no = request.GET.get('transaction_id')
        trade_status = request.GET.get('trade_state')
        if trade_status == '0':
            bills = Bills.objects.get(bill=tn)
            bills.trade_status = trade_status
            bills.bill_status = 'down'
            bills.save()
            where = bills.where
            if where == 'cart':
                conf = pay_cart_return(bills)
                return render(request, 'payment/cart.html', conf)
            elif where == 'detail':
                goods = pay_detail_return(bills)
                return HttpResponseRedirect('/shop/goods-detail?goods_id=%s'%goods.id)
        else:
            return HttpResponse('fail')
    return HttpResponse('fail')

@csrf_exempt
def ten_notify_url(request):
    '''
    description:tenpay异步通知
    params:
    return:
    '''
    if request.method == 'POST':
        if tenpay.ten_notify_verify(request.POST):
            tn = request.POST.get('out_trade_no')
            trade_status = request.POST.get('trade_state')
            if trade_status == '0':
                bills = Bills.objects.get(bill=tn)
                bills.trade_status = trade_status
                bills.bill_status = 'down'
                bills.save()
                where = bills.where
                if where == 'cart':
                    conf = pay_cart_return(bills)
                elif where == 'detail':
                    goods = pay_detail_return(bills)
                return HttpResponse('success')
            else:
                return HttpResponse('fail')
        return HttpResponse('fail')
