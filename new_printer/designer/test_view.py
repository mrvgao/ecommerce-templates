from django.shortcuts import render

def test(request):
    return render(request, 'designer/designer-show.html')

 