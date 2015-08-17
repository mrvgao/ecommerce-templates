from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response, render

from configuration.models import Goods
from conf import website

from shop.utility.goods_handler import GoodsHandler

# Create your views here.

def index(request):
    return render(request,website.index)


def goods_detail(request):
    return render(request,website.goods_detail)
