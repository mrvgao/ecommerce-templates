# coding:utf-8
import os

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
for i in ip.readlines():
    if DEPLOY_SERVER_ADDRESS in i:
        in_deploy_server = True
        break

if in_deploy_server:
    # set static server address
    server = DEPLOY_SERVER_ADDRESS
else:
    server = TEST_SERVER_ADDRESS

server_path = 'http://%(server)s:8888/static/' % {'server': server}
server_upload = 'http://%(server)s:8888/file/upload' % {'server': server}
server_download = 'http://%(server)s:8888/file/download' % {'server': server}
server_ip = 'http://%(server)s:8888/' % {'server': server}


file_server_path = 'http://%(server)s:8888/static/' % {'server': server}
file_server_upload = 'http://%(server)s:8888/file/stlupload' % {'server': server}
file_server_download = 'http://%(server)s:8888/file/download' % {'server': server}
file_server_ip = 'http://%(server)s:8888/' % {'server': server}
file_server_imgupload = 'http://%(server)s:8888/file/imgupload' % {'server': server}

stl = 'stl'
pic = 'jpg'
small = 'jpg'
