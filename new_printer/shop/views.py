# coding=utf-8
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse
import json

from conf import website
from configuration import website as admin_website

from configuration.models import Goods
from configuration.models import Designer_User

from utils.common_class import IndexGoods
from utils.common_class import IndexGoodsDesigner

from shop.utils.goods_handler import GoodsHandler
from utility.common_handler import CommonHandler

# Create your views here.
goods_handler = GoodsHandler()
common_handler = CommonHandler()

def index(request):

    type_name = [u'戒指',u'吊坠',u'耳坠',u'手链',u'项链',u'胸针']
    type_class = ['ring','pendant','earbob','bracelet','torque','brooch']
    nubmer = 6

    type_list = []
    for i in range(nubmer):
        temp_list = goods_handler.get_all_goods_by_tags(type_name[i])
        goods_list = modify_goods_list(temp_list)
        index_goods_designer = IndexGoodsDesigner()
        index_goods_designer.set_index_goods_designer(goods_list,type_class[i],type_name[i])
        type_list.append(index_goods_designer)

    context = {
        'type_list':type_list,
    }

    return render(request,website.index,context)


def filter_type(request):

    style = request.POST['style'].strip()
    tag = request.POST['type'].strip()

    tag_list = goods_handler.get_all_goods_by_tags(tag)
    tag_style_list = goods_handler.get_goods_by_style(tag_list,style)

    goods_list = []
    for goods in tag_style_list:
        designer_name = Designer_User.objects.filter(id = goods.designer_id).designername
        temp = (goods.goods_name,goods.description,goods.preview_1,goods.preview_2,goods.preview_3,goods.goods_price,designer_name)
        goods_list.append(temp)

    context = {
        'goods_list':goods_list,
    }
    return HttpResponse(json.dumps(context))

def modify_goods_list(goods_list):
    return_list = []
    for goods in goods_list:
        designer_name = Designer_User.objects.get(id = goods.designer_id).designername
        index_goods = IndexGoods()
        index_goods.set_index_goods(goods,designer_name)
        index_goods.goods.preview_1 = common_handler.get_file_path(str(index_goods.goods.preview_1))
        return_list.append(index_goods)
    return return_list

def goods_detail(request):
    return render(request,website.goods_detail)
