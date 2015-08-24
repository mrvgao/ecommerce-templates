# coding=utf-8
class IndexGoods(object):
    def __init__(self):
        self.goods = None
        self.designer = None

    def set_index_goods(self,goods,designer):
        self.goods = goods
        self.designer = designer


class IndexGoodsDesigner(object):
    def __init__(self):
        self.goods_list = None
        self.type_class = None
        self.type_name = None

    def set_index_goods_designer(self,goods_list,type_class,type_name):
        self.goods_list = goods_list
        self.type_class = type_class
        self.type_name = type_name


class TagGoods(object):

    def __init__(self, goods):
        self.goods_id = goods[0]
        self.goods_name = goods[1]
        self.goods_img = goods[2]
        self.goods_classify = goods[3]
        self.goods_mark = goods[4]
        self.goods_download_num = goods[5]
        self.goods_mark_num = goods[6]
        self.goods_price = goods[7]
