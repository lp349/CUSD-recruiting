from django import forms
from mainsite.models import Application, Posting, Opening
from django.core import validators
from django.forms.util import ErrorList, ErrorDict 
from django.utils.translation import gettext as _

MAX_UPLOAD_SIZE= 1048576

class ApplicationForm(forms.ModelForm):

    #this function check for valid upload file type
    def validate_file_extensions(value):
      if not (value.name.endswith('.pdf') or value.name.endswith('.doc') or value.name.endswith('.docx')):
        raise forms.ValidationError(u'Invalid file extension')
    #this function check for valid upload file size
    def validate_file_size(value):
      if value.size > MAX_UPLOAD_SIZE:
        raise forms.ValidationError(u'Exceed Maximum file size 1MB!')

    netID = forms.CharField(max_length=10, help_text="Your Cornell netID:")
    resume = forms.FileField(help_text="Resume Upload:", max_length=MAX_UPLOAD_SIZE, allow_empty_file=False, 
        validators=[validate_file_extensions, validate_file_size], error_messages={'resume_error': _(u'Upload resume again!')})
    #retieve all roles from database
    all_role_choices = [(role.pk, role.title) for role in Opening.objects.all()]
    role_multiselect = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple, help_text="Select Roles", choices = all_role_choices, required=False)
    #retrieve all projects from datacase
    all_projects_choices = [(project.pk, project.name) for project in Posting.objects.filter(posting_type="project")]
    project_multiselect = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple, help_text="Select Projects", choices = all_projects_choices, required=False)

    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = Application
        fields = ('netID', 'resume', 'role_multiselect', 'project_multiselect')

    