from django import forms
from mainsite.models import Photo, Opening, Posting

class PostingForm(forms.ModelForm):
    
    #slug = forms.CharField(widget=forms.HiddenInput(), required=False)
    #hidden forms
    posting_type = forms.CharField(widget=forms.HiddenInput(), initial="Project")
    #posting_type = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
    name = forms.CharField(max_length=500)
    tagline = forms.CharField(max_length=4096)
    description = forms.TextField()
    photos = forms.ManyToManyField(Photo)
    openings = forms.ManyToManyField(Opening)
    detail_icon_path = forms.FilePathField("/home/images", max_length=255)
    list_thumbnail_path = forms.FilePathField("/home/images", max_length=255)
    rank = forms.PositiveIntegerField()
    
    #validation
    def clean(self):
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
        return cleaned_data
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = Posting
        #fields = ('name',)


class OpeningForm(forms.ModelForm):
    title = forms.CharField(max_length=128, help_text="Please enter the title of the role.")
    description = forms.CharField(max_length=200, help_text="Please enter the description of the role.")
    #views = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
    
    class Meta:
        # Provide an association between the ModelForm and a model
        model = Opening

