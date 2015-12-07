
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from mainsite.models import Posting, Opening, Application
from django import forms
from forms import ApplicationForm


import json

#limit uploads to 1MB
MAX_UPLOAD_SIZE= 1048576

def index(request):
     return render(request, "add_application.html")


#add a new application
'''
this function display the application form and save the completed form to database
arguments:
  request - Django HttpRequest Object
once submitted, it will redirect to url /application/
'''

def add_application(request):
  context = {}

  # A HTTP POST?
  size_error=False #boolean to indicate if the exceed max size
  has_uploaded=True #boolean to indicate if the resume is uploaded or not
  if request.method == 'POST':
    form = ApplicationForm(request.POST, request.FILES)
    
    #print request.FILES
    form.fields['netID'].required = True
    form.fields['resume'].required = True
    form.fields['project_multiselect'].required=False
    form.fields['role_multiselect'].required=False
    print (form.is_valid())
    # Have we been provided with a valid form?
    if form.is_valid():
        #first create a new role in the opening database
        #and then add a record to the relation
        application=Application()
        application.netID=form.cleaned_data['netID']
      
        if 'resume' in request.FILES:
          if request.FILES['resume'].size < MAX_UPLOAD_SIZE:
            application.resume = request.FILES['resume']
            application.save()
          else:
            print "The size is too big!"
            size_error=True
        else:
          has_uploaded=False  #boolean to indicate if the resume is uploaded or not

        for role_id in form.cleaned_data['role_multiselect']:
          role=Opening.objects.get(pk=role_id)
          if role:
            application.roles.add(role)
          else:
              print "application_form_handler: role specified by primary key does not exist"
        for project_id in form.cleaned_data['project_multiselect']:
          project=Posting.objects.get(pk=project_id)
          if project:
            application.projects.add(project)
          else:
              print "application_form_handler: project specified by primary key does not exist"

        application.save()

        # The user will be shown the homepage.
        #return HttpResponseRedirect("https://docs.google.com/forms/d/1z_U_r4fsO2PAWWIBkzUQ50Y92RjJwMxvXeMfGy4UO6Y/viewform?edit_requested=true") #add some pop up window for confirmation of save 
    	return HttpResponseRedirect("http://goo.gl/forms/W3J0WYUxEM")
    else:
        # The supplied form contained errors - just print them to the terminal and redirect to application site 
        print ('error is: %s' %form.errors)
        #return HttpResponseRedirect("/application/add_application/")

  else:
      # If the request was not a POST, display the form to enter details.
    form = ApplicationForm()
    all_role_choices = [(role.pk, role.title) for role in Opening.objects.all()]
    all_projects_choices = [(project.pk, project.name) for project in Posting.objects.filter(posting_type="project", published=True)]
    
    form.fields['role_multiselect'].choices = all_role_choices
    form.fields['project_multiselect'].choices = all_projects_choices

  context = {
      'form': form,
      'projects': Posting.objects.filter(posting_type='project', published=True).order_by('-rank'),
      'role_types': Posting.objects.filter(posting_type='role_type', published=True)
  }

  # Render the form with error messages (if any).
  return render(request, 'add_application.html', context)

