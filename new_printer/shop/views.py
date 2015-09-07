# coding=utf-8
from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
import json
import pdb

from conf import website

from configuration.models import Goods
from configuration.models import Designer_User
from configuration.models import Vender_User
from configuration.models import Good_record

from utils.common_class import IndexGoods
from utils.common_class import IndexGoodsDesigner
from utils.common_class import TagGoods

from shop.utils.goods_handler import GoodsHandler
from shop.utils.goods_handler import RecommendGoodsHandler
from utility.common_handler import CommonHandler
from utility.vender_goods_handler import VenderGoodsHandler
from social.utils.social_handler import CollectionHandler

per_page_num = 16
goods_handler = GoodsHandler()
common_handler = CommonHandler()
vender_goods_handler = VenderGoodsHandler()
recommend_goods_handler = RecommendGoodsHandler()
collection_handler = CollectionHandler()


def login_register(request):
    '''
    dsecription:登录注册页
    '''

    return render(request, website.login_register, None)


def password_find(request):
    '''
    description:密码查找
    '''

    return render(request, website.password_find, None)


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


def index(request):
    if not request.user.is_authenticated():
        return render(request, website.index)
    else:
        return home(request)


def get_vender_id(request):

    user = request.user
    try:
        vender_id = Vender_User.objects.get(user_id=user.id).id
    except ObjectDoesNotExist:
        vender_id = None
    return vender_id


def get_is_collected(goods_id, vender_id):
    if vender_id:
        is_collected = vender_goods_handler.get_is_collected(goods_id, vender_id)
    else:
        is_collected = False
    return is_collected


def get_is_buy(goods_id, vender_id):
    if vender_id:
        is_buy = vender_goods_handler.get_is_buy(goods_id, vender_id)
    else:
        is_buy = False
    return is_buy


def get_is_cart(goods_id, vender_id):
    if vender_id:
        is_cart = vender_goods_handler.get_is_cart(goods_id, vender_id)
    else:
        is_cart = False
    return is_cart


def get_style_param(request):
    try:
        style = request.GET['goods_type']
    except:
        style = None
    return style


def get_style_list(goods_list, style):
    if style:
        style_list = goods_handler.get_goods_by_style(goods_list, style)
    else:
        style_list = goods_list
    return style_list


def home(request):

    class HomeGoods(object):

        def __init__(self, goods):
            self.goods_id = goods[0]
            self.goods_name = goods[1]
            self.goods_img = goods[2]
            self.goods_price = goods[3]
            self.goods_mark = goods[4]

    def change_to_home_goods(goods_list, vender_id):
        return_list = []
        for goods in goods_list:
            is_collected = get_is_collected(goods.id, vender_id)
            goods_param = (goods.id, goods.goods_name, common_handler.get_file_path(goods.preview_1),
                           goods.goods_price, is_collected)
            home_goods = HomeGoods(goods_param)
            return_list.append(home_goods)
        return return_list

    vender_id = get_vender_id(request)
    goods_list = Goods.objects.all()
    recommend_goods_list = goods_handler.comprehension_sort(goods_list)[:6]
    recommend_list = change_to_home_goods(recommend_goods_list, vender_id)
    hot_goods_list = goods_handler.sort_by_download(goods_list)[:6]
    hot_list = change_to_home_goods(hot_goods_list, vender_id)

    context = {
        'home': True,
        'recommend_list': recommend_list,
        'hot_list': hot_list,
    }

    return render(request, website.home, context)


def list(request):

    return render(request, website.list)


def get_tags_list(request, goods_tags):

    vender_id = get_vender_id(request)
    style_param = get_style_param(request)

    goods_list = get_goods_list_by_tags(goods_tags, vender_id, style_param)

    page_length = get_page_length(goods_list)
    goods_list = goods_list[:per_page_num]

    return goods_list, page_length


def ring(request):
    goods_tags = u'戒指'

    goods_list, page_length = get_tags_list(request, goods_tags)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list, 'page_length': page_length,
        'ring': True,
    }

    return render(request, website.list, context)


def pendant(request):
    goods_tags = u'吊坠'

    goods_list, page_length = get_tags_list(request, goods_tags)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list, 'page_length': page_length,
        'pendant': True,
    }

    return render(request, website.list, context)


def earbob(request):
    goods_tags = u'耳坠'

    goods_list, page_length = get_tags_list(request, goods_tags)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list, 'page_length': page_length,
        'earbob': True,
    }

    return render(request, website.list, context)


def bracelet(request):
    goods_tags = u'手链'

    goods_list, page_length = get_tags_list(request, goods_tags)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list, 'page_length': page_length,
        'bracelet': True,
    }

    return render(request, website.list, context)


def torque(request):
    goods_tags = u'项链'

    goods_list, page_length = get_tags_list(request, goods_tags)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list, 'page_length': page_length,
        'torque': True,
    }

    return render(request, website.list, context)


def brooch(request):
    goods_tags = u'胸针'

    goods_list, page_length = get_tags_list(request, goods_tags)

    context = {
        'goods_kind': goods_tags, 'goods_list': goods_list, 'page_length': page_length,
        'brooch': True,
    }

    return render(request, website.list, context)


def get_page_length(goods_list):

    length = len(goods_list)
    if length % per_page_num:
        return length / per_page_num + 1
    else:
        return length / per_page_num


def get_goods_list_by_tags(goods_tags, vender_id, style_param):

    def change_to_tag_goods(sort_goods_list, vender_id):
        goods_list = []
        for goods in sort_goods_list:
            is_collected = get_is_collected(goods.id, vender_id)
            goods_param = (goods.id, goods.goods_name, common_handler.get_file_path(goods.preview_1),
                           goods.tags, is_collected, goods.download_count,
                           goods.collected_count, goods.goods_price)
            tag_goods = TagGoods(goods_param)
            goods_list.append(tag_goods)
        return goods_list

    all_goods_list = goods_handler.get_all_goods_by_tags(goods_tags)
    all_goods_list = all_goods_list.filter(is_active=True)
    style_list = get_style_list(all_goods_list, style_param)
    sort_goods_list = goods_handler.comprehension_sort(style_list)
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

    tag_style_list = get_list_by_tag_style(tag, style)[:per_page_num]
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

    to_tags = {u'戒指': 'ring', u'吊坠': 'pendant', u'耳坠': 'earbob', u'手链': 'bracelet', u'项链': 'torque', u'胸针': 'brooch'}

    class RecommendGoods(object):

        def __init__(self, goods):
            self.goods_id = goods[0]
            self.goods_name = goods[1]
            self.goods_img = goods[2]
            self.goods_price = goods[3]
            self.goods_download_num = goods[4]
            self.goods_mark_num = goods[5]
            self.goods_mark = goods[6]


    def get_recommend_goods_list(recommend_id_list, vender_id):
        recommend_goods_list = []
        for recommend_id in recommend_id_list:
            goods = Goods.objects.get(id=recommend_id)
            is_collected = get_is_collected(goods.id, vender_id)
            goods_param = (goods.id, goods.goods_name, common_handler.get_file_path(goods.preview_1),
                        goods.goods_price, goods.download_count, goods.collected_count, is_collected)
            recommend_goods = RecommendGoods(goods_param)
            recommend_goods_list.append(recommend_goods)
        return recommend_goods_list

    def get_other_goods_list(designer_goods_list, vender_id):
        other_goods_list = []
        for goods in designer_goods_list:
            is_collected = get_is_collected(goods.id, vender_id)
            goods_param = (goods.id, goods.goods_name, common_handler.get_file_path(goods.preview_1),
                        goods.goods_price, goods.download_count, goods.collected_count, is_collected)
            other_goods  = RecommendGoods(goods_param)
            other_goods_list.append(other_goods)
        return other_goods_list

    def get_style(goods):
        goods_style = goods.style.split(',')
        return goods_style[0]

    goods_id = request.GET['goods_id']
    goods = Goods.objects.get(id=goods_id)
    designer_id = goods.designer_id
    designer = Designer_User.objects.get(id=designer_id)
    vender_id = get_vender_id(request)
    is_buy = get_is_buy(goods_id, vender_id)
    is_cart = get_is_cart(goods_id, vender_id)

    is_collected = get_is_collected(goods_id, vender_id)

    Good_record.objects.create(good_id=goods_id)

    goods_img_list = []
    goods_img_list.append(common_handler.get_file_path(goods.preview_1))
    goods_img_list.append(common_handler.get_file_path(goods.preview_2))
    goods_img_list.append(common_handler.get_file_path(goods.preview_3))

    recommend_id_list = recommend_goods_handler.get_recommend_by_id(goods_id)
    recommend_goods_list = get_recommend_goods_list(recommend_id_list, vender_id)

    designer_goods_list = goods_handler.get_other_goods(designer_id, goods_id)
    other_goods_list = get_other_goods_list(designer_goods_list, vender_id)

    context = {
        'goods_id': goods.id, 'goods_name': goods.goods_name, 'goods_img_list': goods_img_list,
        'goods_img': common_handler.get_file_path(goods.preview_1), 'goods_name': goods.goods_name,
        'goods_download_num': goods.download_count, 'goods_mark_num': goods.collected_count, 'goods_mark': is_collected,
        'goods_moduleType': goods.tags, 'goods_description': goods.description, 'is_cart': is_cart,
        'goods_price': goods.goods_price, 'designer_name': designer.designername, 'designer_id': designer_id,
        'goods_tags': goods.tags, 'goods_style': get_style(goods), 'goods_list': to_tags[goods.tags],
        'designer_img': common_handler.get_file_path(str(designer.img)),'isDownload': is_buy,
        'other_goods_list': recommend_goods_list[:4],
        'designer_goods_list': other_goods_list[:4],
    }

    return render(request,website.goods_detail,context)


def sort_goods(request):

    tags_name  = request.POST['list_type']
    sort_name = request.POST['filter_type']
    style_name = request.POST['classify_type']

    goods_list = common_filter(tags_name, sort_name, style_name)
    page_length = get_page_length(goods_list)
    goods_list = goods_list[:per_page_num]

    context = {
        'goods_list': goods_list, 'page_length': page_length,
    }

    return HttpResponse(json.dumps(context))


def filter_goods(request):

    tags_name  = request.POST['list_type']
    sort_name = request.POST['filter_type']
    style_name = request.POST['classify_type']

    goods_list = common_filter(tags_name, sort_name, style_name)
    page_length = get_page_length(goods_list)
    goods_list = goods_list[:per_page_num]

    context = {
        'goods_list': goods_list, 'page_length': page_length,
    }

    return HttpResponse(json.dumps(context))


def paging(request):

    page_now = int(request.POST['num_now']) - 1
    print page_now
    tags_name  = request.POST['list_type'].strip()
    sort_name = request.POST['filter_type'].strip()
    style_name = request.POST['classify_type'].strip()
    print tags_name, sort_name, style_name

    start = page_now * per_page_num
    end = (page_now + 1) * per_page_num
    goods_list = common_filter(tags_name, sort_name, style_name)
    page_length = get_page_length(goods_list)
    goods_list = goods_list[start:end]
    print len(goods_list)

    context = {
        'goods_list': goods_list, 'page_length': page_length,
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


def chat_customer_service_win(request):
    return render(request, website.chat_customer_service_win)


def marking(request):
    goods_id = request.POST['goods_id']
    vender_id = get_vender_id(request)

    if not vender_id:
        return HttpResponse(json.dumps({'state': 'FAILURE'}))

    is_collected = collection_handler.is_collected(vender_id, goods_id)
    if is_collected:
        collection_handler.cancel_collect_goods(vender_id, goods_id)
    else:
        collection_handler.collect_goods(vender_id, goods_id)

    return HttpResponse(json.dumps({'state': 'SUCCESS'}))
