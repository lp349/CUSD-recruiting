from django.http import HttpResponse

def index(request):
    return HttpResponse("hello from the admin portal!")
