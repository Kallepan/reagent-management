from django.contrib import admin
from .models import Reagent, Type, Lot, Location

admin.site.register(Reagent)
admin.site.register(Type)
admin.site.register(Lot)
admin.site.register(Location)
