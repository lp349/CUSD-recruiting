from django.db import models


#very rough definition of models based on what is used in footer.html
class Project(models.Model):
  project_name = models.CharField(max_length=256)
  #may not be needed; the id is used.
  #project_link_id = models.IntegerField(default=0)

class Role(models.Model):
  role_name = models.CharField(max_length=256)
