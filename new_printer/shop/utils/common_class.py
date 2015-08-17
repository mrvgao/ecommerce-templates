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
