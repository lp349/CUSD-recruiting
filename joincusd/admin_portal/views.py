from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from mainsite.models import Posting

import json

def admin_login(request):
  logout(request)
  username = password = ''
  data = {}
  if request.POST:
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None and user.is_active:
      login(request, user)
      return HttpResponseRedirect('/admin/')
    else:
      data['message'] = 'Invalid Username or Password'
  return render_to_response('login.html', context_instance=RequestContext(request, data))

@login_required(login_url='/admin/login/')
def index(request):
     return render(request, "js_test.html")

# arguments:
#   posting_type is a string indicating the type of
#   posting to fetch: 'role_type', 'project', or 'all'
#
# returns:
#   a JSON object representing the following Python object
#   [Posting object, Posting object...]
def posting_list(request, posting_type):

     postings = Posting.objects.filter(posting_type=posting_type)
     result_list = []

     for post in postings:
          post_object = {}
          post_object["name"] = post.name
          post_object["posting_type"] = post.posting_type
          post_object["id"] = post.id

          result_list.append(post_object)

     response = json.dumps(result_list)
     return HttpResponse(response)

def posting(request):
    # A HTTP POST?
    if request.method == 'POST':
        form = PostingForm(request.POST)
        request_dict={}
        # Have we been provided with a valid form?
        if form.is_valid():
            name=form.cleaned_data['posting_name'];
            # hidden input posting type 
            posting_type=
            tagline=form.cleaned_data['posting_tagline'];
            description=form.cleaned_data['posting_description'];
            rank=form.cleaned_data['posting_rank'];
            role=form.cleaned_data['select_roles'];
            

            # Now call the index() view.
            # The user will be shown the homepage.
            return index(request)
        else:
            # The supplied form contained errors - just print them to the terminal.
            print form.errors
    else:
        # If the request was not a POST, display the form to enter details.
        form = PostingForm()

    # Bad form (or form details), no form supplied...
    # Render the form with error messages (if any).
    return render(request, 'admin_portal/[Temp] templates and css/posting.html', {'form': form})
