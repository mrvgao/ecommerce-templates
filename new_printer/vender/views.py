from django.shortcuts import render

from django.http import HttpResponseRedirect

from configuration.models import Vender_User
from configuration.models import Bills
from configuration.models import Goods_Bills
from configuration.models import Designer_User
from configuration.models import Vender_Goods
from configuration.models import Goods

from conf import website

from utility.common_handler import CommonHandler


common_handler = CommonHandler()


def test(request):
    return render(request, website.test)


def vender_center(request):

    class VenderBills(object):

        def __init__(self):
            self.goods_id = None
            self.goods_name = None
            self.goods_price = None
            self.goods_img = None
            self.description = None
            self.designer_name = None
            self.bill_id = None
            self.download_time = None

        def set_vender_bills(self, vender_bill):
            self.goods_id = vender_bill[0]
            self.goods_name = vender_bill[1]
            self.goods_price = vender_bill[2]
            self.goods_img = vender_bill[3]
            self.description = vender_bill[4]
            self.designer_name = vender_bill[5]
            self.bill_id = vender_bill[6]
            self.download_time = vender_bill[7]

    def get_bills_goods_information(bills_goods_list, vender_id, bill):
        vender_bills_list = []
        for bills_goods in bills_goods_list:
            goods = Goods.objects.get(id=bills_goods.goods_id)
            designer = Designer_User.objects.get(id=goods.designer_id)
            designer_name = designer.designername
            vender_goods = Vender_Goods.objects.filter(goods_id=goods.id).get(vender_id=vender_id)
            vender_bills = VenderBills()
            vender_bills_param = (goods.id, goods.goods_name, goods.goods_price,
                                  common_handler.get_file_path(goods.preview_1),
                                  goods.description, designer_name, bill.bill,
                                  vender_goods.download_time)
            vender_bills.set_vender_bills(vender_bills_param)
            vender_bills_list.append(vender_bills)
        return vender_bills_list

    def get_bills_information(bills_list, vender_id):
        vender_bills_list = []
        for bill in bill_list:
            bills_goods_list = Goods_Bills.objects.filter(bills_id=bill.id)
            vender_bills_part_list = get_bills_goods_information(bills_goods_list, vender_id, bill)
            vender_bills_list.extend(vender_bills_part_list)
        return vender_bills_list

    vender_id = 2

    vender = Vender_User.objects.get(id=vender_id)

    bill_list = Bills.objects.filter(vender_id=vender_id)

    vender_bills_list = get_bills_information(bill_list, vender_id)

    context = {
        'vender_name': vender.vendername, 'vender_img': common_handler.get_file_path(str(vender.img)),
        'vender_bills_list': vender_bills_list,
    }

    return render(request, website.vender_center, context)


def designers_collection(request):
	return render(request,website.designers_collection)

def works_collection(request):
	return render(request,website.works_collection)

# setup
def set_account(request):
	return render(request, website.set_account)

# logout
def logout_account(request):
	return HttpResponseRedirect('/')
