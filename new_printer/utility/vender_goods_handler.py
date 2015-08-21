# coding=utf-8
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime,timedelta

from configuration.models import Goods
from configuration.models import Vender_User
from configuration.models import Vender_Goods


class VenderGoodsHandler(object):

    def get_element(self,vender_id,goods_id):
        try:
            element = Vender_Goods.objects.filter(vender_id = vender_id).get(goods_id = goods_id)
        except ObjectDoesNotExist:
            element = None
        return element


    def set_is_collected(self,vender_goods,is_collected):
        vender_goods.is_collected = is_collected
        vender_goods.save()


    def get_is_collected(self, goods_id, vender_id):
        vender_goods = self.get_element(vender_id, goods_id)
        if vender_goods:
            return vender_goods.is_collected
        else:
            return False


    def set_collected_time(self,vender_goods):
        vender_goods.collected_time = datetime.now()
        vender_goods.save()
