# -*- coding:UTF-8 -*-

from configuration.models import Bills

import random
import datetime
import time

def now_time():
    ISOTIMEFORMAT='%Y-%m-%d %X'
    date = time.strftime(ISOTIMEFORMAT, time.localtime())
    return date

class BillsManager():
    
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

