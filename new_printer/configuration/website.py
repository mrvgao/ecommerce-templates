# coding:utf-8
import os
import socket

__author__ = 'Minchuian'
__build_data_ = '2015-8-12'
'''
    This is for the static file server configurations.
'''
# 静态服务器地址
DEPLOY_SERVER_ADDRESS = '121.43.234.208'
TEST_SERVER_ADDRESS = '192.168.1.101'

ip = os.popen("cat /etc/network/interfaces | grep address")  # get current ip.
l = []
in_deploy_server = False
is_local_server = False
for i in ip.readlines():
    if DEPLOY_SERVER_ADDRESS in i:
        in_deploy_server = True
        break

if in_deploy_server:
    # set static server address
    server = DEPLOY_SERVER_ADDRESS
else:
    server = TEST_SERVER_ADDRESS

local_server = socket.gethostbyname_ex(socket.gethostname())
if local_server[0] == 'renjie-B85M-D3H':
	is_local_server = True

server_path = 'http://%(server)s:8888/static/' % {'server': server}
server_upload = 'http://%(server)s:8888/file/upload' % {'server': server}
server_download = 'http://%(server)s:8888/file/download' % {'server': server}
server_ip = 'http://%(server)s:8888/' % {'server': server}


file_server_path = 'http://%(server)s:8888/static/' % {'server': server}
file_server_upload = 'http://%(server)s:8888/file/stlupload' % {'server': server}
file_server_download = 'http://%(server)s:8888/file/download' % {'server': server}
file_server_ip = 'http://%(server)s:8888/' % {'server': server}
file_server_imgupload = 'http://%(server)s:8888/file/imgupload' % {'server': server}
icon_server_upload = 'http://%(server)s:8888/file/upload' % {'server': server}

stl_3dlove = 'http://www.3dilove.com/stl_static/'  #存放stl文件的路径
stl_local = 'http://192.168.1.101/stl_static/'

stl = 'stl'
pic = 'jpg'
small = 'jpg'

reason_failed = [u'模型文件大',
				 u'错了，不是模型文件',
				 u'背景颜色']
good_tags = [u'戒指',u'吊坠',u'耳坠',u'手链',u'项链',u'胸针']

good_style = [u'青春洋溢',u'富丽典雅',u'自然亲切',u'时尚潮流']
