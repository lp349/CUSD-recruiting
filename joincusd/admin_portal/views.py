import os
import zipfile
import StringIO
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from mainsite.models import Posting, Opening, Application
from django.conf import settings
from django import forms
from forms import PostingForm, OpeningForm
import json

'''
function to handle admin log in.
User will suplly username and password.
If the user is able to authenticate, they will be directed to the admin page.
If not, a error message will be displayed.
'''
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

'''
Will be able to access this page if it is logged in. If not, will be directed to login page.
If logged in, the admin user sees the current project listings that are displayed on the main joincusd mainsite.
'''
@login_required(login_url='/admin/login/')
def index(request):
     return render(request, "list.html")

@login_required(login_url='/admin/login/')
def toggle_publish(request, model_type, pk):
  model = None
  if model_type == "role":
    model = Opening.objects.get(pk=pk)
  elif model_type == "role_type":
    model = Posting.objects.filter(posting_type=model_type).get(pk=pk)
  elif model_type == "project":
    model = Posting.objects.filter(posting_type=model_type).get(pk=pk)
  if model:
    model.published = not model.published
    print model.published
    model.save()
    return HttpResponse(status=201)
  return HttpResponse(status=404)

# arguments:
#   posting_type is a string indicating the type of
#   posting to fetch: 'role_type', 'project', or 'all'
#
# returns:
#   a JSON object representing the following Python object
#   [Posting object, Posting object...]
#   with the name, id, and posting_type fields exposed
@login_required(login_url='/admin/login/')
def posting_list(request, posting_type):

     postings = Posting.objects.filter(posting_type=posting_type)
     result_list = []

     for post in postings:
          post_object = {}
          post_object["name"] = post.name
          post_object["posting_type"] = post.posting_type
          post_object["id"] = post.id
          post_object["roles"] = [opening.title for opening in post.openings.all()]
          post_object["rank"] = post.rank
          post_object["published"] = post.published

          result_list.append(post_object)

     response = json.dumps(result_list)
     return HttpResponse(response)

@login_required(login_url='/admin/login/')
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
    return render(request, 'admin_portal/[Temp] templates and css/change_posting.html', {'form': form})

# arguments:
#   none except required HttpRequest
#
# returns:
#   a JSON object representing the following Python object
#   [Opening object, Opening object...]
#   with title, description fields exposed
@login_required(login_url='/admin/login/')
def role_list(request):
     roles = Opening.objects.all()
     result_list = []

     for role in roles:
         role_object = {}
         role_object["title"] = role.title
         role_object["description"] = role.description
         role_object["id"]=role.id
         result_list.append(role_object)

     response = json.dumps(result_list)
     return HttpResponse(response)

def update_ranks(request):
     print request.POST.get("rank_string", '')
     object_list = json.loads(request.POST.get("rank_string", ''))

     for obj in object_list:
         posting = Posting.objects.get(pk = obj["projectId"])
         posting.rank = obj["newRank"]
         posting.save()

     return HttpResponse()

def generate_short_name(name):
  # If the name is a single word - use full name lowercased as short_name
  if len(name.split()) == 1:
    return name.lower()

  # Otherwise, generate an acronym based on that name for the shortname
  short_name = filter(unicode.isupper, name.title()).lower()

  short_names = Posting.objects.values_list('short_name', flat=True).filter(short_name__startswith=short_name)
  if not short_names:
    return short_name

  # If the acronym is already taken, generate a new one
  conflict = False
  possible_postfix = 0
  for s in short_names:
    if s == short_name:
      conflict = True
    if s[len(short_name):]:
      postfix = s[len(short_name):]
      try:
        possible_postfix = max(possible_postfix, int(postfix) + 1)
      except ValueError:
        pass
  if conflict:
    return short_name + str(possible_postfix)
  else:
    return short_name

'''
  this function displays the website form on a page GET, and
  handles adding NEW postings for either projects or role types.

  in the event of an invalid submitted form under a POST request,
  redisplays form with filled in data and error list.

  arguments:
    request - Django HttpRequest Object
    posting_type - a string containing either the value "project" or "roletype"

  additionally, the function dynamically sets the form submission url, depending on the roletype. there are only 2 possible variations
    add_project/
    add_role_type/

'''
def add_posting_handler(request, posting_type):
    if request.method == "POST":
        form = PostingForm(request.POST, request.FILES)

        #although the field was deleted in the GET request,
        #it must be nonrequired to pass validation when adding a role type
        if posting_type == "role_type":
            form.fields['short_project_description'].required = False
            #del form.fields['short_project_description']

        if form.is_valid():
            project = Posting()

            project.posting_type = posting_type
            project.name = form.cleaned_data['name']
            project.short_name = generate_short_name(project.name)
            project.tagline = form.cleaned_data['tagline']
            project.icon_color = form.cleaned_data['icon_color']
            #internally assigned to be the last!
            project.rank = len(Posting.objects.all())

            #passing validation guarantees existence of these files (their required attribute is set)
            project.colored_icon = request.FILES['colored_icon']
            project.uncolored_icon = request.FILES['uncolored_icon']
            project.photo_one = request.FILES['photo_one']
            project.photo_two = request.FILES['photo_two']
            project.photo_three = request.FILES['photo_three']

            project.photo_one_alt_text = form.cleaned_data['photo_one_alt_text']
            project.photo_two_alt_text = form.cleaned_data['photo_two_alt_text']
            project.photo_three_alt_text = form.cleaned_data['photo_three_alt_text']

            project.description = form.cleaned_data['description']
            project.additional_description = form.cleaned_data['additional_description']
            if posting_type == "project":
                project.short_project_description = form.cleaned_data['short_project_description']
            else:
                project.short_project_description = ""

            #because this is a new addition, we'll need to save the object first so that the many to many field can be used
            project.save()

            #add each role to the many set
            project.openings.clear()
            for role_pk_val in form.cleaned_data['role_multiselect']:
                role = Opening.objects.get(pk=role_pk_val)
                if role:
                    project.openings.add(role)
                else:
                    print "add_posting_handler: role specified by primary key does not exist"

            #save the role updates
            project.save()
            return HttpResponseRedirect("/admin")
        else:
            print "add_posting_handler: invalid form"
            #form_url = "/admin/add_" + posting_type + "/"
            #return HttpResponseRedirect(form_url)
            form_submit_action_url = "/admin/add_" + posting_type + "/"
            return render(request, 'add_posting.html', {'form': form, 'form_submit_action_url':form_submit_action_url, 'posting_type': posting_type})
    elif request.method == "GET":
        form = PostingForm()

        if posting_type == "role_type":
           del form.fields['short_project_description']

        form_submit_action_url = "/admin/add_" + posting_type + "/"
        return render(request, 'add_posting.html', {'form': form, 'form_submit_action_url':form_submit_action_url, 'posting_type': posting_type})
    else:
        #impossible case
        return HttpResponse(response)

'''
  this function displays the website form on a page GET, and
  handles editing EXISTING postings for either projects or role types.

  in the case of an invalidated form for a POST request, the function
  redisplays the submitted form and its errors. NOTE that potentially empty
  unrequired fields are merged from the existing database copy.
  ***THIS IS DONE BY FIRST DISPLAYING HTE FORM POPULATED BY request.POST,
  request.FILES, BUT SETTING ITS INSTANCE TO THE EXISTING DATABASE OBJECT.

  arguments:
    request - Django HttpRequest Object
    posting_type - a string containing either the value "project" or "roletype"
    pk - a string containing the primary key of the postings object chosen for editing

  additionally, the function dynamically sets the form submission url, depending on the roletype. there are only 2 possible variations
    edit_project/<project_pk>/
    edit_role_type/<role_type_pk>/p
'''
def edit_posting_handler(request, posting_type, pk):
    if request.method == "POST":
        form = PostingForm(request.POST, request.FILES)

        #since existing posting objects passed validation at time of creation,
        #image/file upload fields and their alt descriptions should be optional
        form.fields['colored_icon'].required = False
        form.fields['uncolored_icon'].required = False
        form.fields['photo_one'].required = False
        form.fields['photo_two'].required = False
        form.fields['photo_three'].required = False
        form.fields['photo_one_alt_text'].required = False
        form.fields['photo_two_alt_text'].required = False
        form.fields['photo_three_alt_text'].required = False

        #although the field was deleted in the GET request,
        #it must be nonrequired to pass validation when adding a role type
        if posting_type == "role_type":
            form.fields['short_project_description'].required = False
            #del form.fields['short_project_description']

        if form.is_valid():
            project = Posting.objects.get(pk=pk)

            if not project:
                print "edit_posting_handler: primary key for editing project does not point to an existing project"
                return render(request, 'generic_error.html', {error_text: 'You have tried to edit a nonexistent posting.'})
                #return HttpResponseRedirect("/admin")

            project.posting_type = posting_type
            project.name = form.cleaned_data['name']
            #TODO(lpei): Remove this, only for testing purposes
            if not project.short_name:
              project.short_name = generate_short_name(project.name)
              print project.short_name
            project.tagline = form.cleaned_data['tagline']
            project.icon_color = form.cleaned_data['icon_color']

            #since file uploads may be optional,
            #we have to check that they exist!
            if 'colored_icon' in request.FILES:
                project.colored_icon = request.FILES['colored_icon']
            if 'uncolored_icon' in request.FILES:
                project.uncolored_icon = request.FILES['uncolored_icon']
            if 'photo_one' in request.FILES:
                project.photo_one = request.FILES['photo_one']
            if 'photo_two' in request.FILES:
                project.photo_two = request.FILES['photo_two']
            if 'photo_three' in request.FILES:
                project.photo_three = request.FILES['photo_three']

            project.photo_one_alt_text = form.cleaned_data['photo_one_alt_text']
            project.photo_two_alt_text = form.cleaned_data['photo_two_alt_text']
            project.photo_three_alt_text = form.cleaned_data['photo_three_alt_text']

            project.description = form.cleaned_data['description']
            project.additional_description = form.cleaned_data['additional_description']
            if posting_type == "project":
                project.short_project_description = form.cleaned_data['short_project_description']
            else:
                project.short_project_description = ""

            #add each role to the many set
            project.openings.clear()
            for role_pk_val in form.cleaned_data['role_multiselect']:
                role = Opening.objects.get(pk=role_pk_val)
                if role:
                    project.openings.add(role)
                else:
                    print "edit_posting_handler: role specified by primary key does not exist"

            #save the role updates
            project.save()
            return HttpResponseRedirect("/admin")
        else:
            print "edit_posting_handler: form was not valid"
            #print form.errors

            #since the form is only created with request.POST and request.FILES
            #any empty nonrequired fields must be filled in with the existing
            #object in the database before we redisplay it, else we get errors
            #like nonattached files for nonedited photos

            posting = Posting.objects.get(pk=pk)

            if not posting:
                return render(request, 'generic_error.html', {error_text: 'You have tried to edit a nonexistent posting.'})

            form.instance = posting


            form_submit_action_url = "/admin/edit_" + posting_type + "/" + pk + "/"
            return render(request, 'edit_posting.html', {'form': form, 'form_submit_action_url':form_submit_action_url, 'posting_type': posting_type})

    elif request.method == "GET":
        posting_object = Posting.objects.get(pk=pk)
        if posting_object and posting_object.posting_type == posting_type:
            form = PostingForm(instance = posting_object)

            if posting_type == "role_type":
               del form.fields['short_project_description']

            #IMPORTANT: the submit action url must be set correctly!
            form_submit_action_url = "/admin/edit_" + posting_type + "/" + pk + "/"

            #additionally, since there is no direct mapping from
            #the model's openings set to the form's MultipleChoiceField,
            #we'll need to generate the initial checked choices
            initial_choices = []
            for role in posting_object.openings.all():
                initial_choices.append(role.pk)
                form.fields['role_multiselect'].initial = initial_choices
                all_role_choices = [(role.pk, role.title) for role in Opening.objects.all()]
                form.fields['role_multiselect'].choices = all_role_choices

            return render(request, 'edit_posting.html', {'form': form, 'form_submit_action_url':form_submit_action_url, 'posting_type': posting_type})

        else:
            print "edit_posting_handler: pk points to a nonexistent object"
            return render(request, 'generic_error.html', {error_text: 'You have tried to edit a nonexistent posting.'})
            #return HttpResponseRedirect("/admin")
    else:
        #impossible case
        return HttpResponse(response)

'''
Required: The user has logged in.
This function displays a form that allows user to add a new role, and is also able to add this new role under role types and projects that has such role.
argument:
    request - Django HttpRequest Object
'''
@login_required(login_url='/admin/login/')
def add_role(request):
    # A HTTP POST?
  if request.method == 'POST':
      form = OpeningForm(request.POST)
      # Have we been provided with a valid form?
      if form.is_valid():
          #first create a new role in the opening database
          title=form.cleaned_data['title']
          description=form.cleaned_data['description']
          new_role=Opening(title=title, description=description)
          new_role.save()
          # get the projects the user wants to connect with this role
          postings=form.cleaned_data['selected_projects']
          # consider multiple projects that may be related to such opening.
          for posting_id in postings:
            posting=Posting.objects.get(pk=posting_id)
            if posting:
              # add the new relation (projects - roles related to the projects) into mainsite_posting_openings
              print posting.openings.all()
              posting.openings.add(new_role)
            else:
              print "No such project"
          #get the role types that the role is under
          role_types=form.cleaned_data['selected_role_types']
          #allow one role to be under multiple role types
          for role_id in role_types:
            posting=Posting.objects.get(pk=role_id)
            if posting:
              #add the new relation into mainsite_posting_openings
              posting.openings.add (new_role)
            else:
              print "No such Role type"
          # Now call the index() view.
          # The user will be shown the homepage.
          return HttpResponseRedirect("/admin/") #add some pop up window for confirmation of save
      else:
          # The supplied form contained errors - just print them to the terminal.
          print form.errors
  else:
      # If the request was not a POST, display the form to enter details.
      form = OpeningForm()
  # Bad form (or form details), no form supplied...
  # Render the form with error messages (if any).
  return render(request, 'change_role.html', {'form': form})

'''
function to remove a role from the mainsite_openings database
It will cascade the changes in the postings table. (The relationship between posting and this opening will be deleted)
In otherwords, if a role is deleted, the projects that originally has this role will not display this role any more.
In addition, this role will also not be displayed any more under any role typles.
  arguments:
    request - Django HttpRequest Object
    pk - a string containing the primary key of the postings object chosen for removal
'''
@login_required(login_url='/admin/login/')
def remove_role(request,pk):
  #find this role that is to be removed
  thisrole=Opening.objects.get(pk=pk)
  #If we can find this role, find all postings that has this opening under it
  if thisrole:
    postings=Posting.objects.filter(openings=thisrole)
    #for each such posting, remove the relationship
    for anypost in postings:
      anypost.openings.remove(thisrole)
    thisrole.delete()
  else:
    print "Cannot find this role"
    print form.errors
  return HttpResponseRedirect("/admin/")

'''
function to remove a project. The relationship between the project and the roles that are linked to the project will
be automatically deleted as well.
  arguments:
    request - Django HttpRequest Object
    pk - a string containing the primary key of the postings object chosen for removal
'''
@login_required(login_url='/admin/login/')
def remove_project(request,pk):
  Posting.objects.filter(pk=pk).delete()
  return HttpResponseRedirect("/admin/")

'''
function to remove a role type. The relationship between the role type and the roles that are linked to the project will
be automatically deleted as well. (Essentially same as remove_project)23
  arguments:
    request - Django HttpRequest Object
    pk - a string containing the primary key of the postings object chosen for removal
'''
@login_required(login_url='/admin/login/')
def remove_role_type(request,pk):
  Posting.objects.filter(pk=pk).delete()
  return HttpResponseRedirect("/admin/")

'''
This function displays a form that allows user to edit a new role.
It displays the original role on the page and allow the user to edit each field (title, description, projects/role types
  linked to the role)
arguments:
    request - Django HttpRequest Object
    pk - a string containing the primary key of the openings object chosen for edit
'''
@login_required(login_url='/admin/login/')
def edit_role(request, pk):
  old_role = None
  if pk:
    old_role=Opening.objects.get(pk=pk)
  if old_role:
    form = OpeningForm(instance=old_role)
    form.form_submit_action_url = "/admin/edit_role/" + pk + "/"

    #Additionally, since there is no direct mapping from
    #the model's openings set to the form's MultipleChoiceField,
    #we'll need to generate the initial checked choices
    initial_roletypes = []
    initial_projects = []
    all_roletypes = []
    all_projects = []

    postings = list(Posting.objects.all())
    for posting in postings:
      print str(posting.pk)+" "+posting.name+" "
      # add the new relation into mainsite_posting_openings
      if posting.posting_type == "role_type":
        all_roletypes.append((posting.pk, posting.name))
      else:
        all_projects.append((posting.pk, posting.name))
      # check if the old role is in this posting's opening
      if old_role in posting.openings.all():
        if posting.posting_type == "role_type":
          initial_roletypes.append(posting.pk)
        else:
          initial_projects.append(posting.pk)

    form.fields['selected_role_types'].choices = all_roletypes
    form.fields['selected_projects'].choices = all_projects
    form.fields['selected_role_types'].initial = initial_roletypes
    form.fields['selected_projects'].initial = initial_projects
    if request.method == 'POST':
      form = OpeningForm(request.POST)
      # Have we been provided with a valid form?
      if form.is_valid():
        #first create a new role in the opening database
        #and then add a record to the relation
        title=form.cleaned_data['title']
        description=form.cleaned_data['description']
        old_role.title=title
        old_role.description=description
        old_role.save()
        postings=map(int, form.cleaned_data['selected_projects'])
        #deselect_id: the postings that were originally linked to the roles
        #but not any more
        deselect_id=set(initial_projects)-set(postings)
        #newselect_id: the postings that needed to be added to
        #the relationship table in order to link to this role
        newselect_id=set(postings)-set(initial_projects)
        #updateselect_id: don't need to do anything for these category
        #updateselect_id=set(postings) & set(initial_projects)

        for posting_id in deselect_id:
          posting=Posting.objects.get(pk=posting_id)
          if posting:
            #remove the relationship
            posting.openings.remove(old_role)
        for posting_id in newselect_id:
          posting=Posting.objects.get(pk=posting_id)
          if posting:
            #add new relationship
            posting.openings.add(old_role)
      return HttpResponseRedirect("/admin")
    else:
        # The supplied form contained errors - just print them to the terminal.
        print form.errors
  else:
    print "posting_form_handler: pk points to a nonexistent object"
    return HttpResponseRedirect("/admin")

  return render(request, 'change_role.html', {'form': form, 'is_edit': True})

def download_all(request):
  files = [app.resume.url[1:] for app in Application.objects.all()]

  if not files:
    return HttpResponse(status="204")

  zip_dir = "Resumes"
  zip_filename = "%s.zip" %zip_dir

  s = StringIO.StringIO()

  zf = zipfile.ZipFile(s, "w")
  for fpath in files:
    _, fname = os.path.split(fpath)
    zip_path = os.path.join(zip_dir, fname)

    zf.write(fpath, zip_path)

  zf.close()

  resp = HttpResponse(s.getvalue(), content_type = "application/x-zip-compressed")
  resp['Content-Dispostiion'] = 'attachment; filename=%s' %zip_filename
  return resp
