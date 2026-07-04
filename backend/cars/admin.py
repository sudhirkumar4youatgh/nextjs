from django.contrib import admin
from .models import Make, Car

@admin.register(Make)
class MakeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'price', 'location')
    list_filter = ('make', 'fuel_type', 'transmission')
    search_fields = ('model', 'location', 'description')
