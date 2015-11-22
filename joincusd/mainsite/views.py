from django.shortcuts import render, render_to_response
from .models import Posting, Opening

# Create your views here.
def index(request):
  context = {
    'title': 'Cornell University Sustainable Design',
    'projects': Posting.objects.filter(posting_type='project'),
    'role_types': Posting.objects.filter(posting_type='role_type')
  }
  return render_to_response('index.html', context)

def projects(request):
  context = {
    'title': 'Projects',
    'projects': Posting.objects.filter(posting_type='project'),
    'role_types': Posting.objects.filter(posting_type='role_type')
  }
  return render_to_response('projects.html', context)

def about(request):
  context = {
    'title': 'About',
    'projects': Posting.objects.filter(posting_type='project'),
    'role_types': Posting.objects.filter(posting_type='role_type')
  }
  return render_to_response('about.html', context)

def posting(request, pk):
  posting = Posting.objects.get(pk=pk)
  context = {
    'title': 'About',
    'projects': Posting.objects.filter(posting_type='project'),
    'role_types': Posting.objects.filter(posting_type='role_type'),
    'type': posting.posting_type,
    'name': posting.name,
    'colored_icon': posting.colored_icon,
    'uncolored_icon': posting.uncolored_icon,
    'icon_color': posting.icon_color,
    'short_name': posting.short_name,
    'tagline': posting.tagline,
    'descriptions': posting.description.split('\n'),
    'additional_descriptions': posting.additional_description.split('\n'),
    'photos': [posting.photo_one, posting.photo_two, posting.photo_three],
    'openings': posting.openings.all()
    }
  return render(request, 'posting.html', context)
