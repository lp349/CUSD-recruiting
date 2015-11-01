from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from mainsite.models import Posting, Opening

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
#   with the name, id, and posting_type fields exposed
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

# arguments:
#   none except required HttpRequest
#
# returns:
#   a JSON object representing the following Python object
#   [Opening object, Opening object...]
#   with title, description fields exposed
def role_list(request):
     roles = Opening.objects.all()
     result_list = []

     for role in roles:
         role_object = {}
         role_object["title"] = role.title
         role_object["description"] = role.description
         result_list.append(role_object)

     response = json.dumps(result_list)
     return HttpResponse(response)
