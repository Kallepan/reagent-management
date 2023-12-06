from django.test import TestCase
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient

from .models import Reagent, Batch, Kind, Analysis, Device, Removal

User = get_user_model()

class BatchAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            identifier='testuser',
            password='testpass',
            email='test@example.com'
        )
        self.user.groups.create(name='PCR')
        self.client.force_authenticate(user=self.user)

        self.kind = Kind.objects.create(
            name='Kontrolle',
        )
        self.analysis = Analysis.objects.create(
            name='ANA1',
        )
        self.device = Device.objects.create(
            name='Device 1',
        )

    def test_create_batch(self):
        """
        Ensure we can create a new batch object.
        """
        url = '/api/v1/pcr/batches/'
        data = {
            'kind_id': self.kind.id,
            'analysis_id': self.analysis.id,
            'device_id': self.device.id,
            'created_by': 'Test User',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Batch.objects.count(), 1)
        self.assertEqual(Batch.objects.get().kind_id, self.kind.id)
        self.assertEqual(Batch.objects.get().analysis_id, self.analysis.id)
        self.assertEqual(Batch.objects.get().device_id, self.device.id)
        self.assertEqual(Batch.objects.get().created_by, 'Test User')

    def test_create_batch_with_invalid_kind_id(self):
        """
        Ensure we can't create a new batch object with an invalid kind_id.
        """
        url = '/api/v1/pcr/batches/'
        data = {
            'kind_id': 999,
            'analysis_id': self.analysis.id,
            'device_id': self.device.id,
            'created_by': 'Test User',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Batch.objects.count(), 0)

    def test_create_batch_with_invalid_analysis_id(self):
        """
        Ensure we can't create a new batch object with an invalid analysis_id.
        """
        url = '/api/v1/pcr/batches/'
        data = {
            'kind_id': self.kind.id,
            'analysis_id': 999,
            'device_id': self.device.id,
            'created_by': 'Test User',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Batch.objects.count(), 0)

    def test_create_batch_with_invalid_device_id(self):
        """
        Ensure we can't create a new batch object with an invalid device_id.
        """
        url = '/api/v1/pcr/batches/'
        data = {
            'kind_id': self.kind.id,
            'analysis_id': self.analysis.id,
            'device_id': 999,
            'created_by': 'Test User',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Batch.objects.count(), 0)

    def test_delete_batch(self):
        """
        Ensure we can delete a batch object.
        """
        batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by='Test User',
        )
        url = f"/api/v1/pcr/batches/{batch.id}/"
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Batch.objects.count(), 0)

    def test_delete_batch_with_invalid_id(self):
        """
        Ensure we can't delete a batch object with an invalid id.
        """
        url = '/api/v1/pcr/batches/999/'
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(Batch.objects.count(), 0)

class ReagentAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            identifier='testuser',
            password='testpass',
            email='test@example.com'
        )
        self.user.groups.create(name='PCR')

        self.client.force_authenticate(user=self.user)
    
        self.kind = Kind.objects.create(
            name='Kontrolle',
        )
        self.analysis = Analysis.objects.create(
            name='ANA1',
        )
        self.device = Device.objects.create(
            name='Device 1',
        )
        self.batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by='Test User',
        )

    def test_create_reagent(self):
        """
        Ensure we can create a new reagent object.
        """
        url = '/api/v1/pcr/reagents/'
        data = {
            'id': 'Reagent1',
            'initial_amount': 10,
            'created_by': 'Test User',
            'batch_id': self.batch.id,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Reagent.objects.count(), 1)
        self.assertEqual(Reagent.objects.get().id, 'Reagent1')
        self.assertEqual(Reagent.objects.get().batch_id, self.batch.id)

    def test_create_reagent_with_invalid_batch_id(self):
        """
        Ensure we can't create a new reagent object with an invalid batch_id.
        """
        url = '/api/v1/pcr/reagents/'
        data = {
            'id': 'Reagent1',
            'initial_amount': 10,
            'created_by': 'Test User',
            'batch_id': 999,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Reagent.objects.count(), 0)
    
    def test_delete_reagent(self):
        """
        Ensure we can delete a reagent object.
        """
        reagent = Reagent.objects.create(
            id='Reagent 1',
            initial_amount=10,
            batch=self.batch,
            created_by='Test User',
        )
        url = f"/api/v1/pcr/reagents/{reagent.id}/"
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Reagent.objects.count(), 0)
    
    def test_delete_reagent_with_invalid_id(self):
        """
        Ensure we can't delete a reagent object with an invalid id.
        """
        url = '/api/v1/pcr/reagents/999/'
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(Reagent.objects.count(), 0)

    def test_search_batch_with_reagents(self):
        """
        Ensure we can search for a batch with reagents.
        """
        batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by='Test User',
        )
        reagent = Reagent.objects.create(
            id='Reagent 1',
            initial_amount=10,
            batch=batch,
            created_by='Test User',
        )
        url = f"/api/v1/pcr/batches/?search={reagent.id}"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['id'], str(batch.id))

    def test_search_no_reagents(self):
        """
        Ensure we can search for a batch with no reagents.
        """
        batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by='Test User',
        )
        url = f"/api/v1/pcr/batches/?search={batch.id}"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 0)

    def test_search_empty_reagents(self):
        """
        Ensure we can search for a batch with empty reagents.
        """
        batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by='Test User',
        )
        reagent = Reagent.objects.create(
            id='Reagent 1',
            # is_empty should be automatically set to True
            initial_amount=0,
            batch=batch,
            created_by='Test User',
        )
        url = f"/api/v1/pcr/batches/?search={reagent.id}&reagents__is_empty=true"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['id'], str(batch.id))

        url = f"/api/v1/pcr/batches/?search={reagent.id}&reagents__is_empty=false"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 0)
        
    def test_removal_set_empty_on_reagent(self):
        """
        Ensure that creation of removal sets the reagent to is_empty.
        And that deletion of removal sets the reagent to not is_empty.
        """
        batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by='Test User',
        )
        reagent = Reagent.objects.create(
            id='Reagent 1',
            initial_amount=10,
            batch=batch,
            created_by='Test User',
        )
        removal = Removal.objects.create(
            reagent=reagent,
            amount=10,
            created_by='Test User',
        )
        removal.save()
        self.assertEqual(reagent.is_empty, True)

        removal.delete()
        self.assertEqual(reagent.is_empty, False)