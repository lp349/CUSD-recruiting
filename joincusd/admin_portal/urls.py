from django.conf.urls import include, patterns, url
from admin_portal import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^login/$', views.admin_login),
    url(r'^ajax/(?P<posting_type>[a-z_]+)/$', views.posting_list)]
