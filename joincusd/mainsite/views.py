from django.shortcuts import render, render_to_response
from .models import Posting, Photo, Opening

# Create your views here.
def index(request):
  return render_to_response('index.html', {'title': 'Cornell University Sustainable Design'})

def projects(request):
  return render_to_response('projects.html', {'title': 'Projects'})

def about(request):
  return render_to_response('about.html', {'title':'About'})

def footer_test(request):
  role_list = Posting.objects.filter(type="role")
  project_list = Posting.objects.filter(type="project")
  context = {'project_list' : project_list,
             'role_list'    : role_list,
            }
  return render(request, 'common/footer.html', context)
