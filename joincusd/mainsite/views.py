from django.shortcuts import render, render_to_response

# Create your views here.
def index(request):
  return render_to_response('index.html', {'title': 'Cornell University Sustainable Design'})

def projects(request):
  return render_to_response('projects.html', {'title': 'Projects'})

def about(request):
  return render_to_response('about.html', {'title':'About'})

def footer_test(request):
  return render_to_response('common/footer.html')
