# coding=utf-8
from configuration.models import Goods
from configuration.models import Vender_Goods

from utility.vender_goods_handler import VenderGoodsHandler
from shop.utils.goods_handler import GoodsHandler

vender_goods_handler = VenderGoodsHandler()
goods_handler = GoodsHandler()

class CollectionHandler(object):

    def is_collected(self, vender_id, goods_id):
        element = vender_goods_handler.get_element(vender_id, goods_id)
        if element:
            return element.is_collected
        else:
            return False


    def collect_goods(self,vender_id,goods_id):
        vender_goods_handler.set_is_collected(vender_id, goods_id, True)
        vender_goods_handler.set_collected_time(vender_id, goods_id)
        goods = goods_handler.get_goods_by_id(goods_id)
        goods_handler.set_collected_count(goods,1)


    def cancel_collect_goods(self,vender_id,goods_id):
        vender_goods_handler.set_is_collected(vender_id, goods_id, False)
        goods = goods_handler.get_goods_by_id(goods_id)
        goods_handler.set_collected_count(goods,-1)
