from django.shortcuts import render
from django.http import HttpResponseRedirect

from configuration.models import Vender_User
from configuration.models import Bills
from configuration.models import Goods_Bills
from configuration.models import Designer_User
from configuration.models import Vender_Goods
from configuration.models import Goods

from conf import website


def test(request):
    vender_id = request.GET['vender_id']
    vender = Vender_User.objects.get(id=vender_id)
    print vender.vendername, str(vender.img)
    bill_list = Bills.objects.filter(vender_id=vender_id)
    for bill in bill_list:
        bills_goods_list = Goods_Bills.objects.filter(bills_id=bill.id)
        for bills_goods in bills_goods_list:
            goods = Goods.objects.get(id=bills_goods.goods_id)
            designer_name = Designer_User.objects.get(id=goods.designer_id).designername
            vender_goods = Vender_Goods.objects.filter(goods_id=goods.id).get(vender_id=vender_id)
            print goods.goods_name, designer_name, bill.id, bill.bill, vender_goods.download_time
    return render(request, website.test)


def vender_center(request):

    class VenderBills(object):

        def __init__(self):
            self.goods_name = None
            self.designer_name = None
            self.bill_id = None
            self.download_time = None

        def set_vender_bills(self, goods_name, designer_name, bill_id, download_time):
            self.goods_name = goods_name
            self.designer_name = designer_name
            self.bill_id = bill_id
            self.download_time = download_time

    def get_bills_goods_information(bills_goods_list, vender_id, bill):
        vender_bills_list = []
        for bills_goods in bills_goods_list:
            goods = Goods.objects.get(id=bills_goods.goods_id)
            designer_name = Designer_User.objects.get(id=goods.designer_id).designername
            vender_goods = Vender_Goods.objects.filter(goods_id=goods.id).get(vender_id=vender_id)
            print goods.goods_name, designer_name, bill.id, bill.bill, vender_goods.download_time
            vender_bills = VenderBills()
            vender_bills.set_vender_bills(goods.goods_name, designer_name, bill.bill, vender_goods.download_time)
            vender_bills_list.append(vender_bills)
        return vender_bills_list

    def get_bills_information(bills_list, vender_id):
        for bill in bill_list:
            bills_goods_list = Goods_Bills.objects.filter(bills_id=bill.id)
            vender_bills_list = get_bills_goods_information(bills_goods_list, vender_id, bill)
        return vender_bills_list

    vender_id = request.GET['vender_id']

    vender = Vender_User.objects.get(id=vender_id)
    print vender.vendername, str(vender.img)

    bill_list = Bills.objects.filter(vender_id=vender_id)

    vender_bills_list = get_bills_information(bill_list, vender_id)

    context = {
        'vender_name': vender.vendername, 'vender_img': str(vender.img),
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
