from django.conf.urls import include, patterns, url
from application import views

urlpatterns = [

    url(r'^$', views.index),
    url(r'^add_application/$', views.add_application)
]


