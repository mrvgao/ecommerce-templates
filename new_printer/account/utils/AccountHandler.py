#-*- coding: UTF-8 -*-

from django.db import transaction
from django.contrib.auth.models import User

from configuration.models import BetaApply, Designer_User, Vender_User
from configuration import website
import random


class Verification():
    '''
    验证
    '''

    def is_phone_exist(self, phone):
        '''
        description:手机号是否存在
        params: phone
        return: 
        '''
        user = User.objects.filter(username=phone).exists()
        return user
    
    def ramdon_dig(self, phone):
        '''
        description:产生验证码，对手机号码随机
        params: phone
        return: 
        '''
        string = ''
        for c in phone[-6:]:
            string += str(self.encrypt(int(c)))
        return string

    
    def encrypt(self, n):
        return (n*2 + 4) % 10

    def ramdon_v(self, n):
        return (n*3 + 5) % 10

    def ramdon_d(self, n):
        return (n*4 + 6) % 10

    def isright_InvitationCode(self, phone, code):
        '''
        description:邀请码是否正确
        params: phone code
        return: True or False
        '''
        try:
            vcode = ''
            dcode = ''
            for p in phone[-4:]:
                vcode += str(self.ramdon_v(int(p)))
                dcode += str(self.ramdon_d(int(p)))
            if code == '1111':#vcode:
                return 'V'
            elif code == '2222':#dcode:
                return 'D'
            else:
                return 'FALSE'
        except Exception as e:
            return 'FALSE'



class UserManager():
    '''
    用户管理
    '''
    def __init__(self):    
        self.v = Verification()
    
    
    @transaction.atomic
    def user_register(self, phone, password, username, identity):
        '''
        description:用户注册
        params: phone, password, identity, username, 
        return: success or failure
        '''
        result = self.v.is_phone_exist(phone)
        if result == 'C':
            return 'FAILURE'
        else:
            new_user = User.objects.create_user(username=phone, password=password)
            new_user.save()
            if identity == 'D':
                new_designer = Designer_User(phone=phone, designername=username, user=new_user)
                new_designer.save()
            elif identity == 'V':
                new_vender = Vender_User(phone=phone, vendername=username, user=new_user)
                new_vender.save()
            else:
                pass
            return 'SUCCESS'


    def user_which(self, user):
        '''
        description:判断哪种用户
        params: user对象
        return: D or V
        '''
        d_user = Designer_User.objects.filter(user=user).exists()
        if (d_user):
            return 'D'
        else:
            v_user = Vender_User.objects.filter(user=user).exists()
            if (v_user):
                return 'V'
            else:
                return 'None'
        return 'None'


    def user_reset_pwd(self, phone, password):
        '''
        description:重置密码
        params: phone, password
        return: SUCCESS
        '''
        user = User.objects.get(username=phone)
        if user:
            user.set_password(password)
            user.save()
            return 'SUCCESS'
        else:
            return 'FAILURE'


    def user_change_phone(self, user, phone):
        '''
        description:修改绑定手机号
        params: user, new_phone
        return: True,False
        '''
        u = User.objects.filter(id=user.id).update(username=phone)
        if u >= 1:
            return True
        else:
            return False
    

    def file_save(self, f_content, f_name, f_type):
        '''
        description:保存头像图片文件
        params:
        reutrn:
        '''
        chunks = ""
        for chunk in model.chunks():
            chunks = chunks + chunk
            boundary = '----------%s' % hex(int(time.time() * 1000))
            data = []
            data.append('--%s' % boundary)
            data.append('Content-Disposition: form-data; name="%s"\r\n' % 'style')
            data.append(f_type)
            data.append('--%s' % boundary)
            data.append('Content-Disposition: form-data; name="%s"; filename="%s"' % ('profile',str(f_name)))
            data.append('Content-Type: %s\r\n' % 'image/png')
            data.append(chunks)
            data.append('--%s--\r\n' % boundary)
            http_url = website.icon_server_upload  #'http://192.168.1.101:8888/file/upload'
            http_body = '\r\n'.join(data)
            req = urllib2.Request(http_url, data=http_body)
            req.add_header('Content-Type', 'multipart/form-data; boundary=%s' % boundary)
            req.add_header('User-Agent','Mozilla/5.0')
            req.add_header('Referer',website.file_server_path)  #'http://192.168.1.101:8888')
            resp = urllib2.urlopen(req, timeout=2545)
            qrcont=resp.read()
            md = json.loads(qrcont)
            md5 = md[name]
            return md5
