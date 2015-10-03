from django.shortcuts import render, render_to_response
from .models import Project, Role

# Create your views here.
def index(request):
  return render_to_response('index.html', {'title': 'Cornell University Sustainable Design'})

def projects(request):
  return render_to_response('projects.html', {'title': 'Projects'})

def about(request):
  return render_to_response('about.html', {'title':'About'})

def footer_test(request):
  role_list = Role.objects.all()
  project_list = Project.objects.all()
  context = {'project_list' : project_list,
             'role_list'    : role_list,
            }
  return render(request, 'common/footer.html', context)
