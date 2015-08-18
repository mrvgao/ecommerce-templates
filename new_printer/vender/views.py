from django.shortcuts import render
from django.http import HttpResponseRedirect

# Create your views here.

def index(request):
	return render(request, 'vender/all-downloads.html')

def collectionDesigners(request):
	return render(request, 'vender/collection-designers.html')

def collectionWorks(request):
	return render(request, 'vender/collection-works.html')

# setup
def accountSetup(request):
	return render(request, 'vender/account-setup.html')

# logout
def accountLogout(request):
	return HttpResponseRedirect('/')