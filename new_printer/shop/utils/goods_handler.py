# coding=utf-8
from django.core.exceptions import ObjectDoesNotExist

from configuration.models import Goods

from utility.common_handler import CommonHandler

class GoodsHandler(object):

    def __init__(self):
        self.common_handler = CommonHandler()

    def get_goods_by_id(self,goods_id):
        try:
            goods = Goods.objects.get(id = goods_id)
        except ObjectDoesNotExist:
            goods = None
        return goods


    def get_all_goods_by_style(self,style):
        goods_style = self.common_handler.utf_to_unicode(style)
        all_goods_list = Goods.objects.all()
        goods_list = self.get_match_list(all_goods_list,style)
        return goods_list


    def get_goods_by_style(self,goods_list,goods_style):
        goods_style = self.common_handler.utf_to_unicode(goods_style)
        style_goods_list = self.get_match_list(goods_list,goods_style)
        return style_goods_list


    def get_match_list(self,goods_list,style):
        match_list = []
        for goods in goods_list:
            goods_style = goods.style.replace('u\'','\'')
            goods_style.decode("unicode-escape")
            if goods_style.find(style) >= 0:
                match_list.append(goods)
        return match_list


    def get_all_goods_by_tags(self,goods_tags):
        goods_tags = self.common_handler.utf_to_unicode(goods_tags)
        goods_list = Goods.objects.filter(tags = goods_tags)
        return goods_list


    def get_goods_by_tags(goods_list, goods_tags):
        goods_tags = self.common_handler.utf_to_unicode(goods_tags)
        tags_goods_list = goods_list.filter(tags=goods_tags)
        return tags_goods_list


    def get_goods_by_designer(self,designer_id):
        goods_list = Goods.objects.filter(designer_id = designer_id)
        return goods_list


    def set_collected_count(self,goods,count):
        goods.collected_count += count
        goods.save()


class RecommendGoodsHandler(object):

    def __init__(self):
        self.goods_handler = GoodsHandler()


    class RecommendGoods(object):

        def __init__(self):
            self.id = None
            self.score = None
