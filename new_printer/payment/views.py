# -*- coding:UTF-8 -*-

from django.shortcuts import render
from django.http import Http404, HttpResponse
from django.contrib.auth.decorators import login_required
from django.db import transaction

from configuration.models import Bills, Goods, Vender_User, Goods_Bills
from utility.BillsHandler import Build_Bills

import time
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
        bill_id = Build_Bills().random_bill()
        user = request.user
        goods_id = '1'
        ISOTIMEFORMAT='%Y-%m-%d %X'
        date = time.strftime(ISOTIMEFORMAT, time.localtime())
        conf = {}
        try:
            vender_user = Vender_User.objects.get(user=user)
            goods = Goods.objects.get(id=goods_id)
        except Exception as e:
            conf = {'status':'user or goods is not found'}
        is_bill_exist = Bills.objects.filter(bill=bill_id).exists()
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
        import pdb
        pdb.set_trace()
        user = request.user
        try:
            vender_user = Vender_User.objects.get(user=user)
            bills = Bills.objects.get(vender=vender_user,bill_status='init')
        except Exception as e:
            return 'bill is not build at before'
        goods_bills = Goods_Bills.objects.filter(bills=bills)
        for gb in goods_bills:
            gb.goods
        conf = {'goods':goods_bills}
        return 'seccess'#render(request, website.index, conf)
    else:
        raise Http404

def add_cart(request):
    '''
    description:添加到购物车
    params:
    return:
    '''


def pay(request):
    '''
    description:支付
    params: gb.bills.id, price,
    return:
    '''

    

