# coding=utf-8
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response, render

from conf import website
from configuration import website as admin_website
from configuration.models import Goods

from shop.utility.goods_handler import GoodsHandler

# Create your views here.
goods_handler = GoodsHandler()

def index(request):
    ring_list = goods_handler.get_all_goods_by_tags(u'戒指')
    pendant_list = goods_handler.get_all_goods_by_tags(u'吊坠')
    eardrop_list = goods_handler.get_all_goods_by_tags(u'耳坠')
    bracelet_list = goods_handler.get_all_goods_by_tags(u'手链')
    necklace_list = goods_handler.get_all_goods_by_tags(u'项链')
    brooch_list = goods_handler.get_all_goods_by_tags(u'胸针')
    context = {
        'ring_list':ring_list,
        'pendant_list':pendant_list,
        'eardrop_list':eardrop_list,
        'bracelet_list':bracelet_list,
        'necklace_list':necklace_list,
        'brooch_list':brooch_list,
    }
    return render(request,website.index,context)


def goods_detail(request):
    return render(request,website.goods_detail)
