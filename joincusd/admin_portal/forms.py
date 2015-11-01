from django import forms
from admin.models import Photo, Opening, Posting

class PostingForm(forms.ModelForm):
    
    slug = forms.CharField(widget=forms.HiddenInput(), required=False)
    type = forms.CharField(max_length=255)
    name = forms.CharField(max_length=500)
    tagline = forms.CharField(max_length=4096)
    description = forms.TextField()
    photos = forms.ManyToManyField(Photo)
    openings = forms.ManyToManyField(Opening)
    detail_icon_path = forms.FilePathField("/home/images", max_length=255)
    list_thumbnail_path = forms.FilePathField("/home/images", max_length=255)
    rank = forms.IntegerField()
    
    # An inline class to provide additional information on the form.
    class Meta:
        # Provide an association between the ModelForm and a model
        model = Posting
        fields = ('name',)


class OpeningForm(forms.ModelForm):
    title = forms.CharField(max_length=128, help_text="Please enter the title of the role.")
    description = forms.CharField(max_length=200, help_text="Please enter the description of the role.")
    #views = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
    
    class Meta:
        # Provide an association between the ModelForm and a model
        model = Opening

