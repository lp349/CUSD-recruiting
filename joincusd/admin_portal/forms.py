from django import forms
from mainsite.models import Opening, Posting

class PostingForm(forms.ModelForm):
    name = forms.CharField(max_length=500, help_text="Name:")
    tagline = forms.CharField(max_length=100, help_text="Tagline:")
    short_project_description = forms.CharField(max_length=300, help_text="Short Project Description:")
    description = forms.CharField(widget=forms.Textarea(attrs={'cols': 50, 'rows': 10}), help_text="Starting Description:")
    additional_description = forms.CharField(widget=forms.Textarea(attrs={'cols': 50, 'rows': 10}), help_text="Additional Description:")

    #TODO: three temporary photos for now
    photo_one = forms.ImageField(help_text="Photo 1:")
    photo_two = forms.ImageField(help_text="Photo 2:")
    photo_three = forms.ImageField(help_text="Photo 3:")

    detail_icon_path = forms.FileField(help_text="Detail Icon:")
    list_thumbnail_path = forms.FileField(help_text="Thumbnail Icon:")

    all_role_choices = [(role.pk, role.title) for role in Opening.objects.all()]
    role_multiselect = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple, help_text="Select Roles", choices = all_role_choices, required=False)

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
        fields = ('name', 'tagline', 'short_project_description', 'description',
                  'additional_description', 'detail_icon_path', 'list_thumbnail_path',
                  'role_multiselect', 'photo_one', 'photo_two', 'photo_three',
                  'published')


class OpeningForm(forms.ModelForm):
    title = forms.CharField(max_length=128, help_text="Please enter the title of the role.")
    description = forms.CharField(widget=forms.Textarea(attrs={'cols': 50, 'rows': 10}), max_length=200, help_text="Please enter the description of the role.")
    project_choices=[]
    role_choices=[]
    for x in list(Posting.objects.all()):
        print(x.name, x.posting_type)
        if x.posting_type=="role_type":
            role_choices.append((x.pk, x.name))
        else:
            project_choices.append((x.pk, x.name))
    print role_choices
    selected_projects = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple, choices=project_choices, required=True)
    selected_role_types = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple, choices=role_choices, required=False)
    #views = forms.IntegerField(widget=forms.HiddenInput(), initial=0)

    class Meta:
        # Provide an association between the ModelForm and a model
        model = Opening
        fields = ('title', 'description')

