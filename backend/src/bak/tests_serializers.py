from django.test import TestCase

from .models import Location, Type, Lot
from .serializers import LocationSerializer, TypeSerializer, LotSerializer

class TypeSerializerTest(TestCase):
    def setUp(self):
        self.type = Type.objects.create(name='Test Reagent Type', producer='Test Reagent Producer', article_number='123')

    def test_type_serializer(self):
        serializer = TypeSerializer(instance=self.type)
        expected_data = {
            'id': str(self.type.id),
            'name': 'Test Reagent Type',
            'producer': 'Test Reagent Producer',
            'article_number': '123',
        }

        for k, v in expected_data.items():
            self.assertEqual(serializer.data[k], v)


class LocationSerializerTest(TestCase):
    def setUp(self):
        self.location = Location.objects.create(name='Test Location')
    
    def test_location_serializer(self):
        serializer = LocationSerializer(instance=self.location)
        expected_data = {
            'id': str(self.location.id),
            'name': 'Test Location',
        }
    
        for k, v in expected_data.items():
            self.assertEqual(serializer.data[k], v)


class LotSerializerTest(TestCase):
    def setUp(self) -> None:
        self.type = Type.objects.create(name='Test Reagent Type', producer='Test Reagent Producer')
        self.lot = Lot.objects.create(name='Test Lot', valid_until='2021-12-31', created_by='Test User', type=self.type)

    def test_lot_serializer(self):
        serializer = LotSerializer(instance=self.lot)
        expected_data = {
            'id': str(self.lot.id),
            'name': 'Test Lot',
            'valid_from': None,
            'valid_until': '2021-12-31',
            'created_by': 'Test User',
            'in_use_from': None,
            'in_use_until': None,
            'is_empty': True,
        }

        for k, v in expected_data.items(): 
            self.assertEqual(serializer.data[k], v)

        # Check if key 'type', 'reagent', 'is_empty' is in serializer.data
        self.assertIn('reagents', serializer.data)
        self.assertIn('type', serializer.data)
        self.assertIn('is_empty', serializer.data)
                    

class LotSerializerValidationTest(TestCase):
    def setUp(self):
        self.lot = Lot.objects.create(name='Test Lot', valid_until='2021-12-31', created_by='Test User', type=Type.objects.create())

    def test_lot_serializer_validation(self):
        serializer = LotSerializer(data={
            'name': 'Test Lot2',
            'type_id': self.lot.type.id,
            'valid_from': None,
            'valid_until': '2021-12-31',
            'created_by': 'Test User',
            'in_use_from': None,
            'in_use_until': None
        })

        valid = serializer.is_valid()
        self.assertTrue(valid)