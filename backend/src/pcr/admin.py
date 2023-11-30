from django.contrib import admin

from .models import Kind, Analysis, Device, Batch, Reagent

admin.site.register(Kind)
admin.site.register(Analysis)
admin.site.register(Device)
admin.site.register(Batch)
admin.site.register(Reagent)
