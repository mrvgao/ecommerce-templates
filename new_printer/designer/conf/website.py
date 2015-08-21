#coding:utf-8
file_server_path = 'http://192.168.1.101:8888/static/'
file_server_upload = 'http://192.168.1.101:8888/file/stlupload'
file_server_download = 'http://192.168.1.116:8888/file/download'
file_server_ip = 'http://192.168.1.116:8888/'
file_server_imgupload = 'http://192.168.1.101:8888/file/imgupload'
#toy_server_ip = 'http://121.43.234.208:8888/'
#toy_server_path = 'http://121.43.234.208:8888/static/'
#toy_server_upload = 'http://121.43.234.208:8888/file/upload'
#toy_server_ip = 'http://121.43.234.208:8888/'


stl = 'stl'
pic = 'jpg'
small = 'jpg'
'''
    *****************************************************************
'''

#baseurl = 'http://121.43.234.208/images_storage/'
baseurl = ''

toy_photo_url = ''
# 作品图片
goods_server_url = '%supload'%baseurl
# 3D模型文件
stl_server_url = '%supload'%baseurl
# 用户图片
icon_server_url = '%supload'%baseurl

# 最近浏览
recent_pic_url = '%supload'%baseurl


base_site = 'designer'

edit = '%s/designer-works.html'%base_site
#works_up = '%s/demo.html'%base_site
up_success = '%s/su.html'%base_site
up_error = '%s/error.html'%base_site
#edit = '%s/edit.html'%base_site
#logout_success = '%s/logout.html'%base_site


reason_failed = ['模型文件大',
				 '错了，不是模型文件',
				 '背景颜色']
good_tags = ['戒指',
			'吊坠','耳坠','手链','项链','胸针']

good_style = ['自然','富丽','典雅','青春','时尚']