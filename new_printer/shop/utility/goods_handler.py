from configuration.models import Goods

class GoodsHandler(object):

    def get_all_goods_by_style(self,goods_style):
        goods_list = Goods.objects.filter(style = goods_style)
        return goods_list


    def get_goods_by_style(self,goods_list,goods_style):
        style_goods_list = goods_list.filter(style = goods_style)
        return style_goods_list


