from django.test import TestCase

from .models import Kind, Analysis, Device, Batch, Reagent, Removal
from .serializers import KindSerializer, AnalysisSerializer, DeviceSerializer, BatchSerializer, ReagentSerializer, RemovalSerializer

class KindSerializerTest(TestCase):
    def setUp(self):
        self.kind = Kind.objects.create(
            name='Kontrolle',
        )

    def test_contains_expected_fields(self):
        serializer = KindSerializer(instance=self.kind)
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name']))
    
    def test_name_should_be_invalid(self):
        serializer = KindSerializer(data={'name': 'Invalid name'})
        self.assertFalse(serializer.is_valid())
    
    def test_name_should_be_valid(self):
        serializer = KindSerializer(data={'name': 'Kontrolle'})
        self.assertTrue(serializer.is_valid())

        serializer = KindSerializer(data={'name': 'Standard'})
        self.assertTrue(serializer.is_valid())

        serializer = KindSerializer(data={'name': 'Mastermix'})
        self.assertTrue(serializer.is_valid())

class AnalysisSerializerTest(TestCase):
    def setUp(self):
        self.analysis = Analysis.objects.create(
            name='ANA1',
        )

    def test_contains_expected_fields(self):
        serializer = AnalysisSerializer(instance=self.analysis)
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name']))

class DeviceSerializerTest(TestCase):
    def setUp(self):
        self.device = Device.objects.create(
            name='Device 1',
        )

    def test_contains_expected_fields(self):
        serializer = DeviceSerializer(instance=self.device)
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name']))
    
class RemovalSerializerTest(TestCase):
    def setUp(self):
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
        self.reagent = Reagent.objects.create(
            id='Reagent 1',
            batch=self.batch,
            created_by='Test User',
            initial_amount=1,
        )

    def test_contains_expected_fields(self):
        serializer = RemovalSerializer(instance=Removal.objects.create(
            amount=1,
            created_by='Test User',
            reagent=self.reagent,
        ))
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'amount', 'created_at', 'created_by']))
    
    def test_reagent_id_should_be_invalid(self):
        serializer = RemovalSerializer(data={
            'reagent_id': 999,
            'created_by': 'Test User',
            'amount': 1,
        })
        self.assertFalse(serializer.is_valid())
    
    def test_reagent_id_should_be_valid(self):
        serializer = RemovalSerializer(data={
            'reagent_id': self.reagent.id,
            'created_by': 'Test User',
            'amount': 1,
        })
        self.assertTrue(serializer.is_valid())
    
    def test_amount_should_be_invalid(self):
        serializer = RemovalSerializer(data={
            'amount': -1,
            'reagent_id': self.reagent.id,
            'created_by': 'Test User',
        })
        self.assertFalse(serializer.is_valid())
    
    def test_amount_should_be_valid(self):
        serializer = RemovalSerializer(data={
            'amount': 1,
            'reagent_id': self.reagent.id,
            'created_by': 'Test User',
        })
        self.assertTrue(serializer.is_valid())
    
class ReagentSerializerTest(TestCase):
    def setUp(self):
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

    def test_contains_expected_fields(self):
        serializer = ReagentSerializer(instance=Reagent.objects.create(
            id='Reagent 1',
            batch=self.batch,
            initial_amount=10,
            created_by='Test User',
        ))
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'initial_amount', 'created_at', 'created_by', 'is_empty', 'removals']))
    
    def test_batch_id_should_be_invalid(self):
        serializer = ReagentSerializer(data={
            'batch_id': 999,
            'initial_amount': 1,
            'name': 'Reagent 1',
            'created_by': "TEST",
        })
        self.assertFalse(serializer.is_valid())
    
    def test_batch_id_should_be_valid(self):
        serializer = ReagentSerializer(data={
            'initial_amount': 1,
            'batch_id': self.batch.id,
            'name': 'Reagent 1',
            'created_by': "TEST",
            })
        self.assertTrue(serializer.is_valid())
    
    def test_initial_amount_should_be_invalid(self):
        serializer = ReagentSerializer(data={
            'initial_amount': -1,
            'batch_id': self.batch.id,
            'name': 'Reagent 1',
            'created_by': "TEST",
        })
        self.assertFalse(serializer.is_valid())
    
    def test_initial_amount_should_be_valid(self):
        serializer = ReagentSerializer(data={
            'initial_amount': 1,
            'batch_id': self.batch.id,
            'name': 'Reagent 1',
            'created_by': "TEST",
        })
        self.assertTrue(serializer.is_valid())
    
class BatchSerializerTest(TestCase):
    def setUp(self):
        self.kind = Kind.objects.create(
            name='Kontrolle',
        )
        self.analysis = Analysis.objects.create(
            name='ANA1',
        )
        self.device = Device.objects.create(
            name='Device 1',
        )

    def test_contains_expected_fields(self):
        serializer = BatchSerializer(instance=Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by='Test User',
        ))
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'kind', 'analysis', 'device', 'comment', 'reagents', 'created_at', 'created_by']))
    
    def test_kind_id_should_be_invalid(self):
        serializer = BatchSerializer(data={
            'kind_id': 999,
            'analysis_id': self.analysis.id,
            'device_id': self.device.id,
            'created_by': 'Test User',
        })
        self.assertFalse(serializer.is_valid())
    
    def test_kind_id_should_be_valid(self):
        serializer = BatchSerializer(data={
            'kind_id': self.kind.id,
            'analysis_id': self.analysis.id,
            'device_id': self.device.id,
            'created_by': 'Test User',

        })
        self.assertTrue(serializer.is_valid())
    
    def test_analysis_id_should_be_invalid(self):
        serializer = BatchSerializer(data={
            'analysis_id': 999,
            'kind_id': self.kind.id,
            'device_id': self.device.id,
            'created_by': 'Test User',
        })
        self.assertFalse(serializer.is_valid())
    
    def test_analysis_id_should_be_valid(self):
        serializer = BatchSerializer(data={
            'analysis_id': self.analysis.id,
            'kind_id': self.kind.id,
            'device_id': self.device.id,
            'created_by': 'Test User',
        })
        self.assertTrue(serializer.is_valid())
    
    def test_device_id_should_be_invalid(self):
        serializer = BatchSerializer(data={
            'device_id': 999,
            'analysis_id': self.analysis.id,
            'kind_id': self.kind.id,
            'created_by': 'Test User',
        })
        self.assertFalse(serializer.is_valid())
    
    def test_device_id_should_be_valid(self):
        serializer = BatchSerializer(data={
            'device_id': self.device.id,
            'analysis_id': self.analysis.id,
            'kind_id': self.kind.id,
            'created_by': 'Test User',
        })
        self.assertTrue(serializer.is_valid())

class ReagentTests(TestCase):
    def setUp(self) -> None:
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

    def test_is_empty_functionality(self):
        # create non-empty reagent
        reagent_one = Reagent.objects.create(
            id='Reagent 1',
            batch=self.batch,
            created_by='Test User',
            initial_amount=20,
        )
        self.assertFalse(reagent_one.is_empty)

        # create empty reagent
        reagent_two = Reagent.objects.create(
            id='Reagent 2',
            batch=self.batch,
            created_by='Test User',
            initial_amount=0,
        )
        self.assertTrue(reagent_two.is_empty)

        # remove from non-empty reagent
        Removal.objects.create(
            amount=10,
            created_by='Test User',
            reagent=reagent_one,
        )
        self.assertFalse(reagent_one.is_empty)

        # remove from non-empty reagent
        Removal.objects.create(
            amount=10,
            created_by='Test User',
            reagent=reagent_one,
        )
        self.assertTrue(reagent_one.is_empty)

    def test_removal_functionality(self):
        reagent = Reagent.objects.create(
            id='Reagent 1',
            batch=self.batch,
            created_by='Test User',
            initial_amount=20,
        )
        Removal.objects.create(
            amount=10,
            created_by='Test User',
            reagent=reagent,
        )
        self.assertEqual(reagent.current_amount, 10)

        Removal.objects.create(
            amount=10,
            created_by='Test User',
            reagent=reagent,
        )
        self.assertEqual(reagent.current_amount, 0)

    def test_should_not_remove_more_than_current_amount(self):
        reagent = Reagent.objects.create(
            id='Reagent 1',
            batch=self.batch,
            created_by='Test User',
            initial_amount=10,
        )

        removal = RemovalSerializer(data={
            'amount': 20,
            'created_by': 'Test User',
            'reagent_id': reagent.id,
        })
        self.assertFalse(removal.is_valid())
        self.assertEqual(removal.errors['non_field_errors'][0], 'Amount to be removed is greater than the current amount.')
