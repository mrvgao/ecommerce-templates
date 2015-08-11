#!/usr/bin/env python
# encoding: utf-8
# *-* coding: utf-8 -*-
'''
* data: 2015-8-10 8:17
  use: designer's personal
'''
from django.contrib.auth.decorators import login_required
from django.contrib.auth import *
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from conf import website
import json, os, uuid, base64, platform, requests
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext
from django import forms
from adminer.conf import website as adminer_website
from adminer.models import Toy_photo
from django.contrib.auth.models import User
import httplib, urllib
import urllib2,os
from datetime import date ,datetime
import time
import json,pdb


@login_required
def design_list(request):
'''
	个人中心首页，按时间列出全部作品
'''
	user = request.user
    designer = Designer.objects.get(user_id=user.id)
    designer.icon = str(adminer_website.icon_server_path) + designer.icon
    design_list = Goods.objects.filter(customer_id=customer.id)
    collect_num = 0
    all_list = []
    for design in design_list:
    	if design.collect > 1:
    		collect_num++
    	tem_arr = {
                    'id':order.id,
                    'desinger':designer.nickname,
                    'curren_states':states.STATES_DICT[order.custom_state],
                    'add_time':order.add_time,
                    'img_path':adminer_website.icon_server_path,
                    'custom_number':order.custom_number,
                    'custom_price':order.custom_price,
                    'custom_material':order.custom_material,
                    'active':active,
                    'finish_time':order.finish_time
                    }
        all_list.append()

def downed_list(request):
'''
展示按照下载次数排序结果
'''
	pass


def collect_list(request):
'''
按照被收藏的个数排序
'''
	pass


def new_list(request):
'''
最新上传的作品排序
'''
	pass


def ring_list(request):
'''
点击戒指，列出戒指的所以设计作品
'''
	pass


def pendant_list(request):
'''
点击吊坠，列出吊坠的所以设计作品
'''
	pass


def eardrop_list(request):
	pass


def barcedt_list(request):
	pass


def necklace_list(request):
	pass


def show_more(request):
	pass


def show_detail(request):
	pass

