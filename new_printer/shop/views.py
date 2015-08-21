# coding=utf-8
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse
import json
import pdb

from conf import website
from configuration import website as admin_website

from configuration.models import Goods
from configuration.models import Designer_User

from utils.common_class import IndexGoods
from utils.common_class import IndexGoodsDesigner
from utils.common_class import AllGoods

from shop.utils.goods_handler import GoodsHandler
from utility.common_handler import CommonHandler

# Create your views here.
goods_handler = GoodsHandler()
common_handler = CommonHandler()

def list(request):

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

    return render(request,website.list,context)


def filter_type(request):

    def get_list_by_tag_style(tags,style):
        tag_list = goods_handler.get_all_goods_by_tags(tags)
        if common_handler.utf_to_unicode(style) != u'全部':
            tag_style_list = goods_handler.get_goods_by_style(tag_list,style)
        else:
            tag_style_list = tag_list
        return tag_style_list


    def change_list_to_json(tag_style_list):
        goods_list = []
        for goods in tag_style_list:
            designer_name = Designer_User.objects.get(id = goods.designer_id).designername
            temp = {
                'name':goods.goods_name,'description':goods.description,
                'preview_1':str(goods.preview_1),'preview_2':str(goods.preview_2),'preview_3':str(goods.preview_3),
                'price':goods.goods_price,'designer_name':designer_name,
            }
            goods_list.append(temp)
        return goods_list

    style = request.POST['style'].strip()
    tag = request.POST['type'].strip()

    tag_style_list = get_list_by_tag_style(tag,style)
    goods_list = change_list_to_json(tag_style_list)


    context = {
        'goods_list':goods_list,
    }

    return HttpResponse(json.dumps(context))


def modify_goods_list(goods_list):
    return_list = []
    for goods in goods_list:
        designer_name = Designer_User.objects.get(id=goods.designer_id).designername
        index_goods = IndexGoods()
        index_goods.set_index_goods(goods, designer_name)
        index_goods.goods.preview_1 = common_handler.get_file_path(str(index_goods.goods.preview_1))
        return_list.append(index_goods)
    return return_list


def goods_detail(request):
    goods_id =  request.GET['goods_id']
    print goods_id
    return render(request,website.goods_detail)
