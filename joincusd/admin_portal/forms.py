from django import forms
from mainsite.models import Photo, Opening, Posting

class PostingForm(forms.ModelForm):
    #this is hardcoded in the project or role type page templates
    #posting_type = forms.IntegerField(widget=forms.HiddenInput(), initial="project")
    name = forms.CharField(max_length=500, help_text="Project Name:")
    tagline = forms.CharField(max_length=4096, help_text="Project Tagline:")
    description = forms.CharField(help_text="Project Description:")

    # these will have to be created by the view function
    #photos = forms.ManyToManyField(Photo)
    #openings = forms.ManyToManyField(Opening)

    #TODO: ignore file image uploads for now
    detail_icon_path = forms.FileField(help_text="Project Detail Icon:")
    list_thumbnail_path = forms.FileField(help_text="Project Thumbnail Icon:")

    #TODO: replace this with a draggable/list precedence interface
    rank = forms.IntegerField(help_text="Project Display Rank:")
    
    all_role_choices = [(role.pk, role.title) for role in Opening.objects.all()]
    role_multiselect = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple, help_text="Select a Role", choices = all_role_choices, required=False)

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
        model = Posting
        fields = ('name', 'tagline', 'description')


class OpeningForm(forms.ModelForm):
    title = forms.CharField(max_length=128, help_text="Please enter the title of the role.")
    description = forms.CharField(max_length=200, help_text="Please enter the description of the role.")
    project_choices=[]
    role_choices=[]
    for x in list(Posting.objects.all()):
        if x.posting_type=="role_type":
            role_choices.append((x.pk, x.name))
        else:
            project_choices.append((x.pk, x.name))
    print role_choices
    selected_projects = forms.MultipleChoiceField(choices=project_choices, required=True)
    selected_role_types = forms.MultipleChoiceField(choices=role_choices, required=False)
    #views = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
    
    class Meta:
        # Provide an association between the ModelForm and a model
        model = Opening
        fields = ('title', 'description')

