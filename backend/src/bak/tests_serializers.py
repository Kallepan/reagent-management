from django.test import TestCase

from .models import Location, Type, Lot
from .serializers import LocationSerializer, TypeSerializer, LotSerializer

import uuid


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
            'created_at': self.type.created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        }
        self.assertEqual(serializer.data, expected_data)


class LocationSerializerTest(TestCase):
    def setUp(self):
        self.location = Location.objects.create(name='Test Location')
    
    def test_location_serializer(self):
        serializer = LocationSerializer(instance=self.location)
        expected_data = {
            'id': str(self.location.id),
            'name': 'Test Location',
            'created_at': self.location.created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        }
        self.assertEqual(serializer.data, expected_data)


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
            'created_at': self.lot.created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            'created_by': 'Test User',
            'in_use_from': None,
            'in_use_until': None,
            'is_empty': True,
        }

        self.assertEqual(serializer.data['id'], expected_data['id'])
        self.assertEqual(serializer.data['name'], expected_data['name'])
        self.assertEqual(serializer.data['is_empty'], expected_data['is_empty'])

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