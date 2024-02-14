from django.urls import path

from . import views

urlpatterns = [
    path('', views.index_view, name='home'),
    path('test-page', views.test_view, name='test-page'),
    path('<str:room_name>/', views.room_view, name='chat-room'),
]