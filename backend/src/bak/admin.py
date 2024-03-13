from django.contrib import admin
from .models import Reagent, Product, Lot, Location, ProductProducer, ProductType

admin.site.register(Reagent)
admin.site.register(ProductType)
admin.site.register(ProductProducer)
admin.site.register(Product)
admin.site.register(Lot)
admin.site.register(Location)
