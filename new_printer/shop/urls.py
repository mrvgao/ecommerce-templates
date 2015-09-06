#coding:utf-8
from django.conf.urls import patterns, url
from shop import views

urlpatterns = patterns('',

        # test
        url('^test$', views.test, name="test"),

        # 展示型首页
        url('^$', views.index, name="index"),

        # 网站内首页
        url('^home$', views.home, name="home"),

        # 登录注册页
        url('^login_register', views.login_register, name='login_register'),

        # 查找密码
        url('^password_find$', views.password_find, name="password_find"),

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

        # 分页
        url('paging', views.paging, name="paging"),

		# 用户和客服聊天
        url('^chat_customer_service_win', views.chat_customer_service_win, name="chat_customer_service_win"),

        # 收藏或取消收藏,ajax
        url('mark-goods', views.marking, name="marking"),
)

