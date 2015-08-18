# -*- coding: utf-8 -*-
'''
Created on 2015-06-04
财付通接口
@author: Wangjh
'''
import types
import hashlib

import xml.etree.ElementTree as Etree
from urllib import urlencode, urlopen
from hashcompat import md5_constructor as md5
from config import settings


def smart_str(s, encoding='utf-8', strings_only=False, errors='strict'):
    """
    Returns a bytestring version of 's', encoded as specified in 'encoding'.

    If strings_only is True, don't convert (some) non-string-like objects.
    """
    if strings_only and isinstance(s, (types.NoneType, int)):
        return s
    if not isinstance(s, basestring):
        try:
            return str(s)
        except UnicodeEncodeError():
            if isinstance(s, Exception):
                # An Exception subclass containing non-ASCII data that doesn't
                # know how to print itself properly. We shouldn't raise a
                # further exception.
                return ' '.join([smart_str(arg, encoding, strings_only,
                                           errors) for arg in s])
            return unicode(s).encode(encoding, errors)
    elif isinstance(s, unicode):
        return s.encode(encoding, errors)
    elif s and encoding != 'utf-8':
        return s.decode('utf-8', errors).encode(encoding, errors)
    else:
        return s

# 网关地址
_GATEWAY = 'https://gw.tenpay.com/gateway/pay.htm?'

# 即时到账交易接口


def create_direct_tenpay_by_user(tn, subject, body, total_fee, ip):
    params = {}
    params['total_fee'] = int(total_fee * 100)
    params['spbill_create_ip'] = ip
    params['return_url'] = settings.TENPAY_RETURN_URL
    params['partner'] = settings.TENPAY_PARTNER
    params['out_trade_no'] = tn.encode('GBK')
    params['notify_url'] = settings.TENPAY_NOTIFY_URL
    params['body'] = body.encode('GBK')

    signature = sign_by_partnerkey(params)
    mysign = signature.upper()
    package = '&'.join(
        [urlencode({key: params[key]}) for key in sorted(params)])
    return _GATEWAY + package + '&sign=%s' % signature.upper()


def sign_by_partnerkey(params):
    base = '&'.join(['%s=%s' % (key, params[key]) for key in sorted(params)])
    base += '&key=' + settings.TENPAY_KEY
    return hashlib.md5(base).hexdigest()


def ten_notify_verify(resp):
    #import pdb
    # pdb.set_trace()
    # 验证--查询服务器此条信息是否有效
    params = {}
    params['notify_id'] = resp.get('notify_id')
    params['partner'] = settings.TENPAY_PARTNER
    params['sign'] = sign_by_partnerkey(params).upper()

    gateway = 'https://gw.tenpay.com/gateway/simpleverifynotifyid.xml'
    cont = urlopen(gateway, urlencode(params)).read()
    context = cont.decode('GBK').encode('utf-8')
    context = context.replace('\r\n', '')
    context = context.replace('GBK', 'utf-8')
    notify_data_tree = Etree.fromstring(context)
    ret_code = notify_data_tree.find("retcode").text
    if ret_code == '0':
        return True
    return False
