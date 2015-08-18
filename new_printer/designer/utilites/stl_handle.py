#!/usr/bin/env python
# encoding: utf-8
# *-* coding: utf-8 -*-
'''
* data: 2015-7-28 8:17
  use: down stl to local to stl_overreview
  '''
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
from adminer.models import Goods_Upload,Goods
from django.contrib.auth.models import User
import httplib, urllib
import urllib2,os
from datetime import date ,datetime
import time
import json,pdb

pwd = os.getcwd()+'/static' #获得static目录
print pwd
class stl_overreview()
    def __init__(self):
            pass
    def show_zoom(self,_url):
        pdb.set_trace()
        stl_path = "%s/.temp/"%pwd
        #_url = request.POST['url']
        local_filename = _url.split('/')[-1]
        r = requests.get(_url, stream=True)
        lists = os.listdir(stl_path)
        aleady_h = _url.split('/')[-1]
        stl_path = stl_path + str(local_filename)
        if aleady_h in lists :
            stl_path = stl_path.split('/')[-3:]
            stl_path = "/".join(stl_path)
            stl_path = '/' + stl_path
            print stl_path
            context = {'stl_path':stl_path}
        else:
            print stl_path
            with open(stl_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=1024):
                    if chunk:  # filter out keep-alive new chunks
                        f.write(chunk)
                        f.flush()
            stl_path = stl_path.split('/')
            stl_path = stl_path[-3:]
            stl_path = "/".join(stl_path)
            stl_path = '/' + stl_path
            print stl_path
            context = {'stl_path':stl_path}
        return context
