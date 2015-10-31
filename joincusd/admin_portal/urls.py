from django.conf.urls import include, patterns, url
from admin_portal import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^ajax/(?P<posting_type>[a-z]+)/$', views.posting_list)]
