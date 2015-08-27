# coding=utf-8
from django.shortcuts import render
from django.http import HttpResponse
import json
import pdb

from conf import website

from configuration.models import Goods
from configuration.models import Designer_User

from utils.common_class import IndexGoods
from utils.common_class import IndexGoodsDesigner
from utils.common_class import TagGoods

from shop.utils.goods_handler import GoodsHandler
from shop.utils.goods_handler import RecommendGoodsHandler
from utility.common_handler import CommonHandler
from utility.vender_goods_handler import VenderGoodsHandler

goods_handler = GoodsHandler()
common_handler = CommonHandler()
vender_goods_handler = VenderGoodsHandler()
recommend_goods_handler = RecommendGoodsHandler()


def new_chat(request):
	return render(request,website.index)

def test(request):

    type_name = [u'戒指', u'吊坠', u'耳坠', u'手链', u'项链', u'胸针']
    type_class = ['ring', 'pendant', 'earbob', 'bracelet', 'torque', 'brooch']
    nubmer = 6

    type_list = []
    for i in range(nubmer):
        temp_list = goods_handler.get_all_goods_by_tags(type_name[i])
        goods_list = modify_goods_list(temp_list)
        index_goods_designer = IndexGoodsDesigner()
        index_goods_designer.set_index_goods_designer(goods_list, type_class[i], type_name[i])
        type_list.append(index_goods_designer)

    context = {
        'type_list': type_list,
    }

    return render(request, website.test, context)


def list(request):

    return render(request, website.list)


def ring(request):
    goods_tags = u'戒指'
    vender_id = 2

    goods_list = get_goods_list_by_tags(goods_tags, vender_id)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list,
    }

    return render(request, website.list, context)


def pendant(request):
    goods_tags = u'吊坠'
    vender_id = 2

    goods_list = get_goods_list_by_tags(goods_tags, vender_id)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list,
    }

    return render(request, website.list, context)


def earbob(request):
    goods_tags = u'耳坠'
    vender_id = 2

    goods_list = get_goods_list_by_tags(goods_tags, vender_id)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list,
    }

    return render(request, website.list, context)


def bracelet(request):
    goods_tags = u'手链'
    vender_id = 2

    goods_list = get_goods_list_by_tags(goods_tags, vender_id)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list,
    }

    return render(request, website.list, context)


def torque(request):
    goods_tags = u'项链'
    vender_id = 2

    goods_list = get_goods_list_by_tags(goods_tags, vender_id)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list,
    }

    return render(request, website.list, context)


def brooch(request):
    goods_tags = u'胸针'
    vender_id = 2

    goods_list = get_goods_list_by_tags(goods_tags, vender_id)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list,
    }

    return render(request, website.list, context)


def get_goods_list_by_tags(goods_tags, vender_id):

    def change_to_tag_goods(sort_goods_list, vender_id):
        goods_list = []
        for goods in sort_goods_list:
            is_collected = vender_goods_handler.get_is_collected(goods.id, vender_id)
            goods_param = (goods.id, goods.goods_name, common_handler.get_file_path(goods.preview_1),
                           goods.tags, is_collected, goods.download_count,
                           goods.collected_count, goods.goods_price)
            tag_goods = TagGoods(goods_param)
            goods_list.append(tag_goods)
        return goods_list

    all_goods_list = goods_handler.get_all_goods_by_tags(goods_tags)
    sort_goods_list = goods_handler.comprehension_sort(all_goods_list)
    goods_list = change_to_tag_goods(sort_goods_list, vender_id)
    return goods_list


def filter_type(request):

    def get_list_by_tag_style(tags, style):
        tag_list = goods_handler.get_all_goods_by_tags(tags)
        if common_handler.utf_to_unicode(style) != u'全部':
            tag_style_list = goods_handler.get_goods_by_style(tag_list, style)
        else:
            tag_style_list = tag_list
        return tag_style_list

    def change_list_to_json(tag_style_list):
        goods_list = []
        for goods in tag_style_list:
            designer_name = Designer_User.objects.get(id=goods.designer_id).designername
            temp = {
                'name': goods.goods_name, 'description': goods.description,
                'preview_1': str(goods.preview_1), 'preview_2': str(goods.preview_2), 'preview_3': str(goods.preview_3),
                'price': goods.goods_price, 'designer_name': designer_name,
            }
            goods_list.append(temp)
        return goods_list

    style = request.POST['style'].strip()
    tag = request.POST['type'].strip()

    tag_style_list = get_list_by_tag_style(tag, style)
    goods_list = change_list_to_json(tag_style_list)

    context = {
        'goods_list': goods_list,
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

    class RecommendGoods(object):

        def __init__(self, goods):
            self.goods_id = goods[0]
            self.goods_name = goods[1]
            self.goods_img = goods[2]
            self.goods_price = goods[3]
            self.goods_download_num = goods[4]
            self.goods_mark_num = goods[5]


    def get_recommend_goods_list(recommend_id_list):
        recommend_goods_list = []
        for recommend_id in recommend_id_list:
            goods = Goods.objects.get(id=recommend_id)
            goods_param = (goods.id, goods.goods_name, common_handler.get_file_path(goods.preview_1),
                        goods.goods_price, goods.download_count, goods.collected_count)
            recommend_goods = RecommendGoods(goods_param)
            recommend_goods_list.append(recommend_goods)
        return recommend_goods_list

    def get_other_goods_list(designer_goods_list):
        other_goods_list = []
        for goods in designer_goods_list:
            goods_param = (goods.id, goods.goods_name, common_handler.get_file_path(goods.preview_1),
                        goods.goods_price, goods.download_count, goods.collected_count)
            other_goods  = RecommendGoods(goods_param)
            other_goods_list.append(other_goods)
        return other_goods_list

    goods_id = request.GET['goods_id']
    goods = Goods.objects.get(id=goods_id)
    designer_id = goods.designer_id
    designer = Designer_User.objects.get(id=designer_id)
    vender_id = 3
    is_buy = vender_goods_handler.get_is_buy(goods_id, vender_id)

    goods_img_list = []
    goods_img_list.append(common_handler.get_file_path(goods.preview_1))
    goods_img_list.append(common_handler.get_file_path(goods.preview_2))
    goods_img_list.append(common_handler.get_file_path(goods.preview_3))

    recommend_id_list = recommend_goods_handler.get_recommend_by_id(goods_id)
    recommend_goods_list = get_recommend_goods_list(recommend_id_list)

    designer_goods_list = goods_handler.get_other_goods(designer_id, goods_id)
    other_goods_list = get_other_goods_list(designer_goods_list)

    context = {
        'goods_id': goods.id, 'goods_name': goods.goods_name, 'goods_img_list': goods_img_list,
        'goods_img': common_handler.get_file_path(goods.preview_1), 'goods_name': goods.goods_name,
        'goods_download_num': goods.download_count, 'goods_mark_num': goods.collected_count,
        'goods_moduleType': goods.tags, 'goods_description': goods.description,
        'goods_price': goods.goods_price, 'designer_name': designer.designername,
        'designer_img': common_handler.get_file_path(str(designer.img)),'isDownload': is_buy,
        'other_goods_list': recommend_goods_list,
        'designer_goods_list': other_goods_list,
    }

    return render(request,website.goods_detail,context)


def sort_goods(request):

    tags_name  = request.POST['list_type']
    sort_name = request.POST['filter_type']
    style_name = request.POST['classify_type']

    goods_list = common_filter(tags_name, sort_name, style_name)

    context = {
        'goods_list': goods_list,
    }

    return HttpResponse(json.dumps(context))


def filter_goods(request):

    tags_name  = request.POST['list_type']
    sort_name = request.POST['filter_type']
    style_name = request.POST['classify_type']

    goods_list = common_filter(tags_name, sort_name, style_name)

    context = {
        'goods_list': goods_list,
    }

    return HttpResponse(json.dumps(context))


def common_filter(tags_name, sort_name, style_name):

    sort_prefix = 'sort_by_'
    sort_map = {'filter_all': 'comprehension_sort', 'filter_download_num': sort_prefix + 'download',
                'filter_mark_num': sort_prefix + 'collect', 'filter_time': sort_prefix + 'time'}
    style_map = {'classify_all': 'all', 'classify_young': u'青春洋溢', 'classify_elegant': u'富丽典雅',
                 'classify_kindness': u'亲切自然', 'classify_fashion': u'时尚潮流'}

    def get_style_list(style_name, tags_list):
        if style_name != 'all':
            style_list = goods_handler.get_goods_by_style(tags_list, style_name)
        else:
            style_list = tags_list
        return style_list

    def get_sorted_list(sort_name, style_list):
        sort_method = getattr(goods_handler, sort_name)
        sorted_list = sort_method(style_list)
        return sorted_list

    def change_list_to_json(sorted_list):
        goods_list = []
        for goods in sorted_list:
            goods_dict = {'goods_name': goods.goods_name, 'goods_img': common_handler.get_file_path(goods.preview_1),
                        'goods_download_num': goods.download_count, 'goods_mark_num': goods.collected_count,
                        'goods_price': goods.goods_price}
            goods_list.append(goods_dict)
        return goods_list

    sort_name = sort_map[sort_name]
    style_name = style_map[style_name]

    tags_list = goods_handler.get_all_goods_by_tags(tags_name)
    style_list = get_style_list(style_name, tags_list)
    sorted_list = get_sorted_list(sort_name, style_list)

    goods_list = change_list_to_json(sorted_list)

    return goods_list
