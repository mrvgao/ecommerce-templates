# coding=utf-8
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from django.http import HttpResponseRedirect

from configuration.models import Vender_User
from configuration.models import Bills
from configuration.models import Goods_Bills
from configuration.models import Designer_User
from configuration.models import Vender_Goods
from configuration.models import Goods
from configuration.models import Vender_Designer

from conf import website

from utility.common_handler import CommonHandler


common_handler = CommonHandler()


def test(request):
    return render(request, website.test)


@login_required
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

    user = request.user
    vender = Vender_User.objects.get(user_id=user.id)
    vender_id = vender.id

    bill_list = Bills.objects.filter(vender_id=vender_id, bill_status='down')

    vender_bills_list = get_bills_information(bill_list, vender_id)

    context = {
        'vender_name': vender.vendername, 'vender_img': common_handler.get_file_path(str(vender.img)),
        'vender_bills_list': vender_bills_list,
    }

    return render(request, website.vender_center, context)


@login_required
def designers_collection(request):

    class DesignerCollection(object):

        def __init__(self):
            self.designer_id = None
            self.designer_name = None
            self.designer_img = None
            self.designer_mark = None

        def set_designer_collection(self, designer_id, name, img, marked_number):
            self.designer_id = designer_id
            self.designer_name = name
            self.designer_img = img
            self.designer_mark = marked_number

    def get_designer_list(vender_designer_list):
        designer_list = []
        for vender_designer in vender_designer_list:
            designer = Designer_User.objects.get(id=vender_designer.designer_id)
            designer_collection = DesignerCollection()
            designer_collection.set_designer_collection(designer.id, designer.designername,common_handler.get_file_path(str(designer.img)),designer.marked_count)
            designer_list.append(designer_collection)
        return designer_list

    user = request.user
    vender = Vender_User.objects.get(user_id=user.id)
    vender_id = vender.id

    vender_designer_list  = Vender_Designer.objects.filter(vender_id=vender_id)
    designer_list = get_designer_list(vender_designer_list)

    context = {
        'vender_name': vender.vendername, 'vender_img': common_handler.get_file_path(str(vender.img)), 'vender_id': vender_id,
        'designer_list': designer_list,
    }

    return render(request,website.designers_collection,context)


@login_required
def works_collection(request):
    class WorksCollection(object):

        def __init__(self):
            self.work_name = None
            self.work_img = None
            self.work_price = None
            self.work_description = None
            self.work_status = None
            self.designer_name = None
            self.goods_id = None

        def set_works_collection(self,work):
            self.work_name = work[0]
            self.work_img = work[1]
            self.work_price = work[2]
            self.work_description = work[3]
            self.work_status = work[4]
            self.designer_name = work[5]
            self.goods_id = work[6]


    def get_work_list(vender_goods_list):
        work_list = []
        for vender_goods in vender_goods_list:
            goods = Goods.objects.get(id=vender_goods.goods_id)
            designer_name = Designer_User.objects.get(id=goods.designer_id).designername
            work_param = (goods.goods_name, common_handler.get_file_path(goods.preview_1),
                          goods.goods_price, goods.description, vender_goods.is_buy, designer_name, goods.id)
            works_collection = WorksCollection()
            works_collection.set_works_collection(work_param)
            work_list.append(works_collection)
        return work_list

    user = request.user
    vender = Vender_User.objects.get(user_id=user.id)
    vender_id = vender.id

    vender_goods_list = Vender_Goods.objects.filter(vender_id=vender_id).filter(is_collected=True)
    work_list = get_work_list(vender_goods_list)

    context = {
        'vender_name': vender.vendername, 'vender_img': common_handler.get_file_path(str(vender.img)),
        'work_list': work_list,
    }

    return render(request, website.works_collection, context)


@login_required
def set_account(request):

    class VenderAccount(object):

        def __init__(self):
            self.vender_name = None
            self.vender_img = None
            self.vender_phone = None
            self.vender_identity = None

        def set_vender_account(self,name, img, phone, identity):
            self.vender_name = name
            self.vender_img = img
            self.vender_phone = phone
            self.vender_identity = identity

    identity = u'商家'
    user = request.user
    vender = Vender_User.objects.get(user_id=user.id)

    vender_account = VenderAccount()
    vender_account.set_vender_account(vender.vendername, common_handler.get_file_path(str(vender.img)),vender.phone, identity)

    context = {
        'vender_name': vender_account.vender_name, 'vender_img': vender_account.vender_img,
        'vender_phone': vender_account.vender_phone, 'vender_identity': vender_account.vender_identity,
    }

    return render(request, website.set_account,context)



def logout_account(request):
	return HttpResponseRedirect('/')
