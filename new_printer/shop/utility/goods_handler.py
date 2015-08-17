from django.core.exceptions import ObjectDoesNotExist

from configuration.models import Goods

from utility.common_handler import CommonHandler

class GoodsHandler(object):

    common_handler = CommonHandler()

    def get_goods_by_id(self,goods_id):
        try:
            goods = Goods.objects.get(id = goods_id)
        except ObjectDoesNotExist:
            goods = None
        return goods


    def get_all_goods_by_style(self,goods_style):
        goods_style = common_handler.utf_to_unicode(goods_style)
        goods_list = Goods.objects.filter(style = goods_style)
        return goods_list


    def get_goods_by_style(self,goods_list,goods_style):
        goods_style = common_handler.utf_to_unicode(goods_style)
        style_goods_list = goods_list.filter(style = goods_style)
        return style_goods_list


    def get_all_goods_by_tags(self,goods_tags):
        goods_tags = GoodsHandler.common_handler.utf_to_unicode(goods_tags)
        goods_list = Goods.objects.filter(tags = goods_tags)
        return goods_list


    def get_goods_by_designer(self,designer_id):
        goods_list = Goods.objects.filter(designer_id = designer_id)
        return goods_list


    def set_collected_count(self,goods,count):
        goods.collected_count += count
        goods.save()
