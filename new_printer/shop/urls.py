#coding:utf-8
from django.conf.urls import patterns, url
from shop import views

urlpatterns = patterns('',

        # test
        url('^test$', views.test, name="test"),

        url('^new_chat$', views.new_chat, name="new_chat"),

        # 展示型首页
        url('^$', views.test, name="index"),

        # 网站内首页
        url('^home$', views.test, name="home"),

        # 商品列表(戒指)
        url('^ring$', views.ring, name="ring"),

        # 商品列表(吊坠)
        url('^pendant$', views.pendant, name="pendant"),

        # 商品列表(耳坠)
        url('^earbob$', views.earbob, name="earbob"),

        # 商品列表(手链)
        url('^bracelet$', views.bracelet, name="bracelet"),

        # 商品列表(项链)
        url('^torque$', views.torque, name="torque"),

        # 商品列表(胸针)
        url('^brooch$', views.brooch, name="brooch"),

        # 商品列表，过滤筛选
        url('^getGoods/filter$', views.sort_goods, name="sort_goods"),

        # 商品列表，过滤筛选
        url('^getGoods/classify$', views.filter_goods, name="filter_goods"),

        # 商品详情页
        url('goods-detail', views.goods_detail, name="goods_detail"),

        # 商品详情页，加入购物车
        url('^goods-detail/addcart$', views.list, name="list"),

        # 商品详情页，下载，返回下载地址
        url('^goods-detail/download$', views.list, name="list"),

        # 首页按类型筛选，ajax
        url('filter-type', views.filter_type, name="filter_type"),
)

