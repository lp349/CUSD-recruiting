from django.db import models
from colorfield.fields import ColorField

#from the data section on github, projects and roles are completely identical
#in all fields, so our initial definition:
#
# 1) reuses the same Posting table for name, tagline, and description
# 2) Photo and Opening are separate tables
# 3) both Photo and Opening have many-to-many relationships to a given Posting

class Opening(models.Model):
  title = models.CharField(max_length=500)
  description = models.TextField()

class Posting(models.Model):
  posting_type = models.CharField(max_length=255, default="project")

  name = models.CharField(max_length=500)
  short_name = models.CharField(max_length=100, default="")
  tagline = models.CharField(max_length=100)
  short_project_description = models.CharField(max_length=300, default="")
  description = models.TextField(default="")
  additional_description = models.TextField(default="")

  photo_one = models.ImageField(upload_to="images/photos/")
  photo_two = models.ImageField(upload_to="images/photos/")
  photo_three = models.ImageField(upload_to="images/photos/")

  photo_one_alt_text = models.CharField(max_length=500, default="")
  photo_two_alt_text = models.CharField(max_length=500, default="")
  photo_three_alt_text = models.CharField(max_length=500, default="")


  openings = models.ManyToManyField(Opening)

  # Default color is CUSD Green
  icon_color = ColorField(default="#3FAB69")
  colored_icon = models.FileField(upload_to="images/icons/")
  uncolored_icon = models.FileField(upload_to="images/icons/")

  rank = models.IntegerField(default=0)

  published = models.BooleanField(default=False)

class Application(models.Model):
  netID=models.CharField(max_length=10)
  resume=models.FileField(upload_to="resumes/")
  roles=models.ManyToManyField(Opening)
  projects=models.ManyToManyField(Posting)
