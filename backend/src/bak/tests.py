from django.test import TestCase
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient

from .models import Location, Type, Lot, Reagent

import logging

class PermissionsTest(TestCase):
    """Test the user model using the APIClient"""
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create(
            identifier='testuser',
            email="testuser@example.com",
            password="testpass123"
        )
        self.type = Type.objects.create(name='Test Type', producer='Test Producer')

    def test_permissions(self):
        data = {
            'name': 'Test Lot 2',
            'valid_until': '2021-12-31',
            'created_by': 'Test User',
            'type_id': self.type.id
        }
            

        # try to post to the api without authentication
        response = self.client.post('/api/v1/bak/lots/', data=data, format='json')
        self.assertEqual(response.status_code, 401)
    

        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/v1/bak/lots/', data=data, format='json')
        self.assertEqual(response.status_code, 403)

        self.user.groups.create(name='BAK')

        # try to post to the api with authentication
        response = self.client.post('/api/v1/bak/lots/', data=data, format='json')
        self.assertEqual(response.status_code, 201)


class TypeTest(TestCase):
    """Test the type model using the APIClient"""
    def setUp(self):
        self.client = APIClient()
        self.type = Type.objects.create(name='Test Type', producer='Test Producer')
        self.type_two = Type.objects.create(name='Test Type 2', producer='Test Producer 2')
    
    def test_get_types(self):
        response = self.client.get('/api/v1/bak/types/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 48) # 48 due to applied initial migrations
    
    def test_type(self):
        response = self.client.get(f'/api/v1/bak/types/{self.type.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.type.name)
        self.assertEqual(response.data['producer'], self.type.producer)


class LotTest(TestCase):
    """Test the lot model using the APIClient"""
    def setUp(self) -> None:
        # create dummy type
        self.type = Type.objects.create(name='Test Type', producer='Test Producer')

        self.client = APIClient()

        # create dummy user
        User = get_user_model()
        self.user = User.objects.create(
            identifier='testuser',
            email="testuser@example.com",
            password="testpass123"
        )
        self.group = self.user.groups.create(name='BAK')

        self.client.force_authenticate(user=self.user)

    def test_get_lots(self):
        response = self.client.get('/api/v1/bak/lots/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_is_empty_filter(self):
        # get empty lot
        response = self.client.get('/api/v1/bak/lots/?is_empty=true')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

        loc = Location.objects.create(name='Test Location')

        lot_two = Lot.objects.create(name='Test Lot 2', valid_until='2021-12-31', created_by='Test User', type=self.type)
        lot_three = Lot.objects.create(name='Test Lot 3', valid_until='2021-12-31', created_by='Test User', type=self.type)
        lot_two.reagents.create(amount=0, created_by=self.user, location=loc)
        response = self.client.get('/api/v1/bak/lots/?is_empty=true')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        # non-empty lot
        lot_three.reagents.create(amount=10, created_by=self.user, location=loc)
        response = self.client.get('/api/v1/bak/lots/?is_empty=false')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data),1)

    def test_get_specific_lot(self):
        lot = Lot.objects.create(name='Test Lot', valid_until='2021-12-31', created_by='Test User', type=self.type)
        response = self.client.get(f'/api/v1/bak/lots/{lot.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], lot.name)
        self.assertEqual(response.data['valid_until'], lot.valid_until)
        self.assertEqual(response.data['created_by'], lot.created_by)

        self.assertEqual(response.data['type']['id'], str(self.type.id))

        self.assertIn('is_empty', response.data)

    def test_delete_lot(self):
        lot = Lot.objects.create(name='Test Lot', valid_until='2021-12-31', valid_from='2022-01-14', created_by='Test User', type=self.type)
        response = self.client.delete(f'/api/v1/bak/lots/{lot.id}/')
        self.assertEqual(response.status_code, 204)

        # check if lot was deleted
        response = self.client.get(f'/api/v1/bak/lots/{lot.id}/')
        self.assertEqual(response.status_code, 404)
        
    def test_create_lot(self):
        # test the creation of a lot
        test_steps = [
            {
                # 'Invalid type',
                'status_code': 400,
                'data': {
                    'name': 'Test Lot',
                    'valid_until': '2021-12-31',
                    'created_by': 'Test User',
                    'type_id': 'Test-Type'
                },
            },
            {
                # 'Invalid data',
                'status_code': 400,
                'data': {
                    'name': None,
                    'valid_until': '2021-12-31',
                    'created_by': 'Test User',
                    'type_id': self.type.id
                }
            },
            {
                # 'Lot created successfully',
                'status_code': 201,
                'data': {
                    'name': 'Test Lot 2',
                    'valid_until': '2021-12-31',
                    'created_by': 'Test User',
                    'type_id': self.type.id
                }
            },
            {
                # 'Lot with this name and type already exists',
                'status_code': 400,
                'data': {
                    'name': 'Test Lot 2',
                    'valid_until': '2021-12-31',
                    'created_by': 'Test User',
                    'type_id': self.type.id
                }
            },
            {
                # 'Invalid valid_until and valid_from',
                'status_code': 400,
                'data': {
                    'name': 'Test Lot 3',
                    'valid_from': '2021-12-31',
                    'valid_until': '2021-12-30',
                    'created_by': 'Test User',
                    'type_id': self.type.id
                }
            },
            {
                # Invalid in_use_from and in_use_until
                # in_use_from must be before in_use_until
                'status_code': 400,
                'data': {
                    'name': 'Test Lot 4',
                    'valid_until': '2021-12-31',
                    'created_by': 'Test User',
                    'in_use_from': '2021-12-31',
                    'in_use_until': '2021-12-30',
                    'type_id': self.type.id,
                }
            }
        ]

        for i, step in enumerate(test_steps):
            logging.debug(f'Step: {i}')

            response = self.client.post('/api/v1/bak/lots/', data=step['data'], format='json')

            self.assertEqual(response.status_code, step['status_code'])

    def test_delete_lot(self):
        lot = Lot.objects.create(name='Test Lot', valid_until='2021-12-31', created_by='Test User', type=self.type)
        
        request = self.client.delete(f'/api/v1/bak/lots/{lot.id}/')
        self.assertEqual(request.status_code, 204)


    def test_update_lot(self):
        lot = Lot.objects.create(name='Test Lot', valid_until='2021-12-31', created_by='Test User', type=self.type)
        
        test_cases = [
            {
                # 'Invalid type',
                'status_code': 400,
                'data': {
                    'valid_until': '2021-12-31',
                    'created_by': 'Test User',
                    'type_id': 'Test Type'
                },
            },
            {
                # valid_from is after valid_until
                'status_code': 400,
                'data': {
                    'valid_from': '2021-12-31',
                    'valid_until': '2021-12-30',
                    'created_by': 'Test User',
                },
            },
            {
                # valid_from is after valid_until
                'status_code': 400,
                'data': {
                    'valid_from': '2023-01-12',
                    'created_by': 'Test User',
                },
            },
            {
                # in_use_from is after in_use_until
                'status_code': 400,
                'data': {
                    'created_by': 'Test User',
                    'in_use_from': '2021-12-31',
                    'in_use_until': '2021-12-30'
                },
            },
            {
                # good request
                'status_code': 200,
                'data': {
                    'created_by': 'Test User',
                    'in_use_from': '2021-12-30',
                    'in_use_until': '2021-12-31'
                },
            },
            {
                # after previous test, update to false values
                'status_code': 400,
                'data': {
                    'created_by': 'Test User',
                    'in_use_from': '2023-01-12',
                },
            }
        ]

        for i, step in enumerate(test_cases):
            logging.debug(f'Update Lot. Step: {i}')
            
            response = self.client.patch(f'/api/v1/bak/lots/{lot.id}/', data=step['data'], format='json')

            self.assertEqual(response.status_code, step['status_code'])

class LocationTest(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.location_one = Location.objects.create(name='Test Location 1')
        self.location_two = Location.objects.create(name='Test Location 2')
    
    def test_get_location(self):
        response = self.client.get('/api/v1/bak/locations/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 4) # migrations from database
    
    def test_get_specific_location(self):
        response = self.client.get(f'/api/v1/bak/locations/{self.location_one.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.location_one.name)

class ReagentTest(TestCase):
    def setUp(self) -> None:
        # create dummy type
        self.type = Type.objects.create(name='Test Type', producer='Test Producer')
        self.type_two = Type.objects.create(name='Test Type 2', producer='Test Producer 2')

        # create dummy lot
        self.lot = Lot.objects.create(name='Test Lot', valid_until='2021-12-31', created_by='Test User', type=self.type)
        self.lot_two = Lot.objects.create(name='Test Lot 2', valid_until='2021-12-31', created_by='Test User', type=self.type_two)

        # create dummy location
        self.location = Location.objects.create(name='Test Location')
        self.location_two = Location.objects.create(name='Test Location 2')

        # create dummy reagent
        self.reagent = Reagent.objects.create(lot=self.lot, location=self.location, created_by='Test User')

        self.client = APIClient()

        # create dummy user
        User = get_user_model()
        self.user = User.objects.create(
            identifier='testuser',
            email="test@example.com",
            password="testpass123"
        )
        self.group = self.user.groups.create(name='BAK')

        self.client.force_authenticate(user=self.user)
    
    def test_get_reagents(self):
        # Check if one reagent is returned
        response = self.client.get('/api/v1/bak/reagents/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

        # Check if multiple reagents are returned
        _ = Reagent.objects.create(lot=self.lot_two, location=self.location_two, created_by=self.user)
        response = self.client.get('/api/v1/bak/reagents/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_get_specific_reagent(self):
        response = self.client.get(f'/api/v1/bak/reagents/{self.reagent.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(str(response.data['location']['id']), str(self.reagent.location.id))
        self.assertEqual(str(response.data['created_by']), str(self.reagent.created_by))

    def test_update_reagent(self):
        test_steps = [
            {
                # 'Invalid lot',
                'status_code': 400,
                'data': {
                    'lot_id': 'Test Lot',
                    'location_id': self.location.id,
                    'created_by': self.user.identifier
                },
            },
            {
                # 'Invalid location',
                'status_code': 400,
                'data': {
                    'lot_id': self.lot.id,
                    'location_id': 'Test Location',
                    'created_by': self.user.identifier
                }
            },
            {
                # 'Invalid created_by',
                'status_code': 400,
                'data': {
                    'lot_id': self.lot.id,
                    'location_id': self.location.id,
                    'created_by': 'Test User'
                }
            },
            {
                # 'Invalid data',
                'status_code': 400,
                'data': {
                    'lot': None,
                    'location': None,
                    'created_by': None
                }
            },
            {
                # 'Reagent updated successfully',
                'status_code': 200,
                'data': {
                    'amount': 10,
                }
            }
        ]

        for i, step in enumerate(test_steps):
            logging.debug(f'Update Reagent. Step: {i}')

            response = self.client.patch(f'/api/v1/bak/reagents/{self.reagent.id}/', data=step['data'], format='json')
            self.assertEqual(response.status_code, step['status_code'])

    def test_create_reagent(self):
        test_steps = [
            {
                # 'Invalid lot and location',
                'status_code': 400,
                'data': {
                    'lot_id': 'Test Lot',
                    'location_id': 'Test Location',
                    'created_by': 'Test User'
                },
            },
            {
                # 'Invalid data',
                'status_code': 400,
                'data': {
                    'lot_id': None,
                    'location_id': None,
                    'created_by': None
                }
            },
            {
                # 'Reagent with this lot and location already exists',
                'status_code': 400,
                'data': {
                    'lot_id': self.lot.id,
                    'location_id': self.location.id,
                    'created_by': self.user.identifier
                }
            },
            {
                # 'Reagent created successfully',
                'status_code': 201,
                'data': {
                    'lot_id': self.lot_two.id,
                    'location_id': self.location_two.id,
                    'created_by': self.user.identifier
                }
            },
        ]

        for i, step in enumerate(test_steps):
            logging.debug(f'Create Reagent. Step: {i}')
            print(step)
            response = self.client.post('/api/v1/bak/reagents/', data=step['data'], format='json')
            self.assertEqual(response.status_code, step['status_code'])