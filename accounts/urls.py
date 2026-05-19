from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('',        views.admin_login,  name='admin_home'),
    path('login/',  views.admin_login,  name='admin_login'),
    path('logout/', views.admin_logout, name='admin_logout'),

    # Dashboard
    path('dashboard/', views.dashboard, name='dashboard'),

    # OTP API
    path('api/send-otp/',   views.send_otp_api,   name='send_otp_api'),
    path('api/verify-otp/', views.verify_otp_api, name='verify_otp_api'),

    # AJAX: counts
    path('api/counts/', views.dashboard_counts, name='dashboard_counts'),

    # AJAX: students
    path('api/students/',                  views.student_list_json,   name='student_list_json'),
    path('api/students/add/',              views.student_add_ajax,    name='student_add_ajax'),
    path('api/students/edit/<int:pk>/',    views.student_edit_ajax,   name='student_edit_ajax'),
    path('api/students/delete/<int:pk>/',  views.student_delete_ajax, name='student_delete_ajax'),

    # AJAX: carousel
    path('api/carousel/',                  views.carousel_list_json,   name='carousel_list_json'),
    path('api/carousel/add/',              views.carousel_add_ajax,    name='carousel_add_ajax'),
    path('api/carousel/edit/<int:pk>/',    views.carousel_edit_ajax,   name='carousel_edit_ajax'),
    path('api/carousel/delete/<int:pk>/',  views.carousel_delete_ajax, name='carousel_delete_ajax'),

    # AJAX: gallery
    path('api/gallery/',                   views.gallery_list_json,   name='gallery_list_json'),
    path('api/gallery/add/',               views.gallery_add_ajax,    name='gallery_add_ajax'),
    path('api/gallery/edit/<int:pk>/',     views.gallery_edit_ajax,   name='gallery_edit_ajax'),
    path('api/gallery/delete/<int:pk>/',   views.gallery_delete_ajax, name='gallery_delete_ajax'),

    # AJAX: contacts
    path('api/contacts/',                  views.contact_list_json,    name='contact_list_json'),
    path('api/contacts/delete/<int:pk>/',  views.contact_delete_ajax,  name='contact_delete_ajax'),
]