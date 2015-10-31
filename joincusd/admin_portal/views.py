from django.http import HttpResponse
from django.shortcuts import render
from mainsite.models import Posting

import json

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
     
