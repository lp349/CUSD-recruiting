from django.conf.urls import include, patterns, url
from admin_portal import views

#TODO: document importance of ordering ajax links

urlpatterns = [
    url(r'^$', views.index),
    url(r'^login/$', views.admin_login),
    url(r'^ajax/toggle_publish/(?P<model_type>[a-z_]+)/(?P<pk>[0-9]+)/$', views.toggle_publish),
    url(r'^ajax/app/$', views.app_list),
    url(r'^ajax/(?P<posting_type>[a-z_]+)/$', views.posting_list),
    url(r'^ajax/roles$', views.role_list),
    url(r'^ajax/update_ranks$', views.update_ranks),
    url(r'^add_project/$', views.add_posting_handler, {'posting_type':'project'}),
    url(r'^add_role_type/$', views.add_posting_handler, {'posting_type':'role_type'}),
    # edit project/role_type url
    url(r'^edit_project/(?P<pk>[0-9]+)/$', views.edit_posting_handler, {'posting_type':'project'}),
    url(r'^edit_role_type/(?P<pk>[0-9]+)/$', views.edit_posting_handler, {'posting_type':'role_type'}),
    # remove project/role_type url
    url(r'^remove_role_type/(?P<pk>[0-9]+)/$',views.remove_role_type),
    url(r'^add_role/$', views.add_role),
    # edit role
    url(r'^edit_role/(?P<pk>[0-9]+)/$',views.edit_role),
    # remove role
    url(r'^remove_role/(?P<pk>[0-9]+)/$', views.remove_role),
    url(r'^remove_project/(?P<pk>[0-9]+)/$', views.remove_project)]


