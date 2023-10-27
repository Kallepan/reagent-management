from django.contrib import admin
from .models import Reagent, ReagentType, Lot, Location

admin.site.register(Reagent)
admin.site.register(ReagentType)
admin.site.register(Lot)
admin.site.register(Location)
