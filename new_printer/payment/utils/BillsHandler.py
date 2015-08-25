# -*- coding:UTF-8 -*-

from configuration.models import Bills, Vender_User, Goods, Vender_Goods, Goods_Bills

import random
import datetime
import time


class BillsManager():

    def now_time(self):
        '''
        description:获取当前时间
        params:
        return: date
        '''
        ISOTIMEFORMAT='%Y-%m-%d %X'
        date = time.strftime(ISOTIMEFORMAT, time.localtime())
        return date
    
    def random_bill(self):
        '''
        description:随机产生订单号
        params:
        return: bill_id
        '''
        arr = str(datetime.date.today()).split('-')
        rstr = arr[0]+arr[1]+arr[2]
        chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789'
        length = len(chars) - 1
        for i in range(18):
            rstr += chars[random.randint(0, length)]
        return rstr

    def is_bill_exist(self, bill_id):
        '''
        description:是否订单存在
        params:
        return: True or False
        '''
        is_bill_exist = Bills.objects.filter(bill=bill_id).exists()
        return is_bill_exist
    
    def authtovender(self, user):
        '''
        description: auth_user转化为vender_user
        params: user对象
        return: object
        '''
        try:
            vender_user = Vender_User.objects.get(user=user)
            return vender_user
        except Exception as e:
            return None

    def addtobill(self, bill_id, vender_user, goods_list, where):
        '''
        description:添加订单
        params: 
        return:
        '''
        price = 0
        subject = ''
        description = ''
        for goods_id in goods_list:
            goods = Goods.objects.get(id = goods_id)
            price += goods.goods_price
            subject += goods.goods_name
            description += goods.description
        is_bill_exist = BillsManager().is_bill_exist(bill_id)
        if(is_bill_exist):
            return None
        else:
            try:
                bills = Bills(bill = bill_id,
                    subject = subject,
                    bill_body = description,
                    total_fee = price,
                    trade_status = 'INIT',
                    bill_status = 'init',
                    bill_time = self.now_time(),
                    vender = vender_user,
                    where = where)
                bills.save()
                return bills
            except Exception as e:
                return None

    def addtogoodsbill(self, bills, goods_list):
        '''
        description:订单包含一个或多个商品
        params: object
        return: 
        '''
        try:
            for goods_id in goods_list:
                goods = Goods.objects.get(id=goods_id)
                goods_bills = Goods_Bills(
                    bills = bills,
                    goods = goods,
                    bills_time = self.now_time())
                goods_bills.save()
            return 'SUCCESS'
        except Exception as e:
            return 'FAILURE'

    def delcart(self, vender_user, goods_list):
        '''
        description:删除购物车
        params:
        return:
        '''
        try:
            for goods_id in goods_list:
                goods = Goods.objects.get(id=goods_id)
                vender_goods = Vender_Goods.objects.filter(goods=goods, vender=vender_user)             
                for vg in vender_goods:
                    vg.is_buy = False
                    vg.buy_time = self.now_time()
                    vg.save()
            return True
        except Exception as e:
            return False

