# coding=utf-8
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response, render

from conf import website
from configuration import website as admin_website

from configuration.models import Goods
from configuration.models import Designer_User

from shop.utility.goods_handler import GoodsHandler

# Create your views here.
goods_handler = GoodsHandler()

def index(request):

    class IndexGoods(object):
        def __init__(self):
            self.goods = None
            self.designer = None

    class IndexGoodsDesigner(object):
        def __init__(self):
            self.goods_list = None
            self.type_class = None
            self.type_name = None

    type_name = [u'戒指',u'吊坠',u'耳坠',u'手链',u'项链',u'胸针']
    type_class = ['ring','pendant','earbob','bracelet','torque','brooch']
    nubmer = 6

    type_list = []
    for i in range(nubmer):
        goods_list = []
        temp_list = goods_handler.get_all_goods_by_tags(type_name[i])
        for temp_goods in temp_list:
            index_goods = IndexGoods()
            index_goods.goods = temp_goods
            index_goods.designer = Designer_User.objects.get(id = temp_goods.designer_id).designername
            goods_list.append(index_goods)
        index_goods_designer = IndexGoodsDesigner()
        index_goods_designer.goods_list = goods_list
        index_goods_designer.type_class = type_class[i]
        index_goods_designer.type_name = type_name[i]
        type_list.append(index_goods_designer)
    context = {
        'type_list':type_list,
    }
    return render(request,website.index,context)


def goods_detail(request):
    return render(request,website.goods_detail)
