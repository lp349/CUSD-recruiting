from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from mainsite.models import Posting, Opening
from django import forms
from forms import PostingForm, OpeningForm


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
     return render(request, "list.html")

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

def posting(request):
    # A HTTP POST?
    if request.method == 'POST':
        form = PostingForm(request.POST)
        request_dict={}
        # Have we been provided with a valid form?
        if form.is_valid():
            posting_rank=form.cleaned_data['rank'];
            possible_ranks=Posting.objects.filter(rank=posting_rank);
            if possible_ranks:
              print "Rank Error!";
            else:
              form.save(commit=True)


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


# the handler function both handles form submissions if request is POST,
# or simply displays the form on a GET page load
#
# posting_type can either be the string "project" or "roletype"
def posting_form_handler(request, posting_type):
    if request.method == "POST":
        print "stuff posted"
        form = PostingForm(request.POST, request.FILES)
        if form.is_valid():
            project = Posting()
            #hidden field will let us tell if we are creating 
            #a roletype or project
            project.posting_type = posting_type
            project.name = form.cleaned_data['name']
            project.tagline = form.cleaned_data['tagline']
            project.description = form.cleaned_data['description']
            project.detail_icon_path = request.FILES['detail_icon_path']
            project.list_thumbnail_path = request.FILES['list_thumbnail_path']
            project.rank = form.cleaned_data['rank']

            #save the object first so that the many to many field can be used
            project.save()
            
            #add each role to the many set
            for role_pk_val in form.cleaned_data['role_multiselect']:
                role = Opening.objects.get(pk=role_pk_val)
                if role:
                    project.openings.add(role)
                else:
                    print "project_form_handler: role specified by primary key does not exist"

            #save the role updates
            project.save()
            return HttpResponseRedirect("/admin")
        else:
            print "project_form_handler: form was not valid"
            print form.errors
            return HttpResponseRedirect(request)
    else:
        form = PostingForm()
        roles = Opening.objects.all()
        return render(request, 'posting.html', {'form': form, 'roles' : roles})


#add a new role
def role(request):
          # A HTTP POST?
  if request.method == 'POST':
      form = OpeningForm(request.POST)
      # Have we been provided with a valid form?
      if form.is_valid():
          #first create a new role in the opening database
          #and then add a record to the relation
          title=form.cleaned_data['title']
          description=form.cleaned_data['description']
          new_role=Opening(title=title, description=description)
          new_role.save()
          postings=form.cleaned_data['selected_projects']
          for posting_id in postings:
            posting=Posting.objects.get(pk=posting_id)
            print str(posting.pk)+" "+posting.name+" "
            if posting:
              # add the new relation into mainsite_posting_openings
              print posting.openings.all()
              posting.openings.add(new_role)
            else:
              print "No such project";
          role_types=form.cleaned_data['selected_role_types']
          print role_types
          for role_id in role_types:
            posting=Posting.objects.get(pk=role_id)
            if posting: 
              #add the new relation into mainsite_posting_openings
              posting.openings.add (new_role)
            else:
              print "No such Role type";

          # Now call the index() view.
          # The user will be shown the homepage.
          return index(request) #add some pop up window for confirmation of save 
      else:
          # The supplied form contained errors - just print them to the terminal.
          print form.errors
  else:
      # If the request was not a POST, display the form to enter details.
      form = OpeningForm()

  # Bad form (or form details), no form supplied...
  # Render the form with error messages (if any).
  return render(request, 'role.html', {'form': form})

