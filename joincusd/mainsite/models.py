from django.db import models

#from the data section on github, projects and roles are completely identical
#in all fields, so our initial definition:
#
# 1) reuses the same Posting table for name, tagline, and description
# 2) Photo and Opening are separate tables
# 3) both Photo and Opening have many-to-many relationships to a given Posting

class Photo(models.Model):
  image = models.ImageField(upload_to="images/", default=None)

  @classmethod
  def create(cls, image):
    image = cls(image=image)
    return image

class Opening(models.Model):
  title = models.CharField(max_length=500)
  description = models.TextField()

class Posting(models.Model):
  posting_type = models.CharField(max_length=255, default='project')
  name = models.CharField(max_length=500)
  tagline = models.CharField(max_length=4096)
  description = models.TextField()
  photos = models.ManyToManyField(Photo)
  photo_one = models.FileField(upload_to="images/")
  photo_two = models.FileField(upload_to="images/")
  photo_three = models.FileField(upload_to="images/")
  openings = models.ManyToManyField(Opening)
  detail_icon_path = models.FileField(upload_to="images/")
  list_thumbnail_path = models.FileField(upload_to="images/")
  rank = models.IntegerField(default=0)

class Application(models.Model):
  netID=models.CharField(max_length=10)
  resume=models.FileField(upload_to="resumes/")
  roles=models.ManyToManyField(Opening)
  projects=models.ManyToManyField(Posting)