from django import forms
from mainsite.models import Application, Posting, Opening
from django.core import validators
MAX_UPLOAD_SIZE= 1048576

class ApplicationForm(forms.ModelForm):
    def validate_file_extensions(value):
      if not (value.name.endswith('.pdf') or value.name.endswith('.doc') or value.name.endswith('.docx')):
        raise forms.ValidationError(u'Invalid file extension')
    #this is hardcoded in the project or role type page templates
    #posting_type = forms.IntegerField(widget=forms.HiddenInput(), initial="project")
    netID = forms.CharField(max_length=10, help_text="Your Cornell netID:")
    
    resume = forms.FileField(help_text="Resume Upload:", max_length=MAX_UPLOAD_SIZE, allow_empty_file=False, validators=[validate_file_extensions])
    
    all_role_choices = [(role.pk, role.title) for role in Opening.objects.all()]
    role_multiselect = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple, help_text="Select Roles", choices = all_role_choices, required=False)

    all_projects_choices = [(project.pk, project.name) for project in Posting.objects.filter(posting_type="project")]

    project_multiselect = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple, help_text="Select Projects", choices = all_projects_choices, required=False)

    '''def clean(self):
        cleaned_data=super(PostingForm, self).clean()
        name=cleaned_data.get("name");
        tagline=cleaned_data.get("tagline");
        desription=cleaned_data.get("description");
        #photos=cleaned_data.get("photos");
        openings=cleaned_data.get("openings");
        #also check the detail_icon_paht, list_thumbname_path
        rank=cleaned_data.get("rank");
        if name and tagline and description and rank:
            if len(name)==0 or len(tagline)==0 or len(description)==0:
                raise forms.ValidationError("At least one field is empty!");
        else: 
            raise forms.ValidationError("At least one field is not completed correctly!");      
        return cleaned_data'''

    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = Application
        fields = ('netID', 'resume', 'role_multiselect', 'project_multiselect')

    