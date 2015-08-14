# -*- coding:UTF-8 -*-

import random
import datetime


class Build_Bills():
    
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
