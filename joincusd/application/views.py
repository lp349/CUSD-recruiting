
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from mainsite.models import Posting, Opening, Application
from django import forms
from forms import ApplicationForm


import json

def index(request):
     return render(request, "add_application.html")
#add a new application
def add_application(request):
  # A HTTP POST?
  if request.method == 'POST':
      form = ApplicationForm(request.POST)
      form.fields['netID'].required = True
      form.fields['resume'].required = True
      form.fields['project_multiselect'].required=True
      form.fields['role_multiselect'].required=False
      # Have we been provided with a valid form?
      if form.is_valid():
          #first create a new role in the opening database
          #and then add a record to the relation
          application=Application()
          application.netID=form.cleaned_data['netID']
          if 'resume' in request.FILES:
            application.resume = request.FILES['resume']
          application.roles = form.cleaned_data['role_multiselect']
          application.projects=form.cleaned_data['project_multiselect']
          application.save()

          # Now call the index() view.
          # The user will be shown the homepage.
          return HttpResponseRedirect("/application/") #add some pop up window for confirmation of save 
      else:
          # The supplied form contained errors - just print them to the terminal.
          form.errors
  else:
      # If the request was not a POST, display the form to enter details.
      form = ApplicationForm()
      print form
      form.form_submit_action_url = "/application/add_application/"
  # Bad form (or form details), no form supplied...
  # Render the form with error messages (if any).
  return render(request, 'add_application.html', {'form': form})

