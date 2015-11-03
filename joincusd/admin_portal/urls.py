from django.conf.urls import include, patterns, url
from admin_portal import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^login/$', views.admin_login),
    url(r'^ajax/(?P<posting_type>[a-z_]+)/$', views.posting_list),
    url(r'^ajax/roles$', views.role_list),
    url(r'^add_project/$', views.posting_form_handler, {'posting_type':'project','is_edit':False,'pk':None}),
    # url(r'^add_role_type/$', views.project_form_handler),
    # edit project/role_type url
    url(r'^edit_project/(?P<pk>[0-9]+)$', views.posting_form_handler, {'posting_type':'project', 'is_edit':True}),
    # url(r'^edit_role_type/(?P<pk>[0-9]+)$',)
    # remove project/role_type url
    # url(r'^remove_project/(?P<pk>[0-9]+)$',)
    # url(r'^remove_role_type/(?P<pk>[0-9]+)$',)
    url(r'^add_role/$', views.role),
    # edit role
    # url(r'^edit_role/(?P<pk>[0-9]+)$',)
    # remove role
    url(r'^remove_role/(?P<pk>[0-9]+)/$', views.remove_role,)]


