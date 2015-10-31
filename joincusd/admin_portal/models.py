from django.db import models

#from the data section on github, projects and roles are completely identical
#in all fields, so our initial definition:
#
# 1) reuses the same Posting table for name, tagline, and description
# 2) Photo and Opening are separate tables
# 3) both Photo and Opening have many-to-many relationships to a given Posting

class Photo(models.Model):
  image_path = models.FilePathField("/home/images", max_length=255)

class Opening(models.Model):
  title = models.CharField(max_length=500)
  description = models.TextField()

class Posting(models.Model):
  posting_type = models.CharField(max_length=255)
  name = models.CharField(max_length=500)
  tagline = models.CharField(max_length=4096)
  description = models.TextField()
  photos = models.ManyToManyField(Photo)
  openings = models.ManyToManyField(Opening)
  detail_icon_path = models.FilePathField("/home/images", max_length=255)
  list_thumbnail_path = models.FilePathField("/home/images", max_length=255)
  rank = models.IntegerField()
