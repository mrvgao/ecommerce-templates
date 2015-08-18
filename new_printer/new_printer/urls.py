"""new_printer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    #url(r'^social/', include('social.urls', namespace='social')),
    url(r'^adminer/', include('adminer.urls', namespace='adminer')),
    url(r'^designer/', include('designer.urls', namespace='designer')),
    url(r'^account/', include('account.urls', namespace='account')),
    url(r'^payment/', include('payment.urls', namespace='payment')),
    url(r'^$', include('shop.urls', namespace='index')),
    url(r'^shop/', include('shop.urls', namespace='shop')),

<<<<<<< HEAD
    url(r'^vc/', include('vender.urls', namespace='venderCenter')),

    # url(r'^payment/', include('payment.urls', namespace='payment')),

=======
>>>>>>> 426fff7874a5bd13f13907eed4bdabbce9a12c51
]
