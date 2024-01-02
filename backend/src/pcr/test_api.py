from django.test import TestCase
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient

from .models import (
    Reagent,
    Batch,
    Kind,
    Analysis,
    Device,
    Removal,
    Amount,
    RecRemovalCounts,
)

User = get_user_model()


class BatchAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            identifier="testuser", password="testpass", email="test@example.com"
        )
        self.user.groups.create(name="PCR")
        self.client.force_authenticate(user=self.user)

        self.kind = Kind.objects.create(
            name="Kontrolle",
        )
        self.analysis = Analysis.objects.create(
            name="ANA1",
        )
        self.device = Device.objects.create(
            name="Device 1",
        )

    def test_batch_first_opened_at_by(self):
        """
        This test checks taht first opened by and opened at are automatically filled after the first Removal creation of a reagent of a Batch
        """
        batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by="Test User",
        )

        reagent = Reagent.objects.create(
            id="Reagent 1",
            initial_amount=10,
            batch=batch,
            created_by="Test User",
        )

        # check if first_opened_at and first_opened_by are None
        batch = Batch.objects.get(id=batch.id)
        self.assertEqual(batch.first_opened_at, None)
        self.assertEqual(batch.first_opened_by, None)

        # create a removal
        removal = Removal.objects.create(
            reagent=reagent,
            amount=10,
            created_by="Test User",
        )
        removal.save()

        # check if first_opened_at and first_opened_by are set
        batch = Batch.objects.get(id=batch.id)
        self.assertNotEqual(batch.first_opened_at, None)
        self.assertNotEqual(batch.first_opened_by, None)

    def test_batch_first_opened_at_by_with_multiple_reagents(self):
        """
        This test checks that first opened by and opened at are automatically filled after the first Removal creation of a reagent of a Batch
        """
        batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by="Test User",
        )

        reagent1 = Reagent.objects.create(
            id="Reagent 1",
            initial_amount=10,
            batch=batch,
            created_by="Test User",
        )
        reagent2 = Reagent.objects.create(
            id="Reagent 2",
            initial_amount=10,
            batch=batch,
            created_by="Test User",
        )

        # check if first_opened_at and first_opened_by are None
        batch = Batch.objects.get(id=batch.id)
        self.assertEqual(batch.first_opened_at, None)
        self.assertEqual(batch.first_opened_by, None)

        # create a removal
        removal = Removal.objects.create(
            reagent=reagent1,
            amount=10,
            created_by="Test User",
        )
        removal.save()

        # check if first_opened_at and first_opened_by are set
        batch = Batch.objects.get(id=batch.id)
        self.assertNotEqual(batch.first_opened_at, None)
        self.assertNotEqual(batch.first_opened_by, None)
        # store the first_opened_at and first_opened_by
        first_opened_at = batch.first_opened_at
        first_opened_by = batch.first_opened_by

        # create a removal
        removal = Removal.objects.create(
            reagent=reagent2,
            amount=10,
            created_by="Test User",
        )
        removal.save()

        # check if first_opened_at and first_opened_by have not changed
        batch = Batch.objects.get(id=batch.id)
        self.assertEqual(batch.first_opened_at, first_opened_at)
        self.assertEqual(batch.first_opened_by, first_opened_by)

    def test_batch_update(self):
        """
        Ensure we can update a batch object.
        """
        batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            comment="Test Comment",
            created_by="Test User",
        )

        url = f"/api/v1/pcr/batches/{batch.id}/"
        data = {
            "comment": "New Comment",
        }

        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, 200)

        batch.refresh_from_db()
        self.assertEqual(batch.comment, "New Comment")

    def test_batch_update_with_invalid_id(self):
        """
        Ensure we can't update a batch object with an invalid id.
        """
        url = "/api/v1/pcr/batches/999/"
        data = {
            "comment": "New Comment",
        }

        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, 404)

    def test_create_batch(self):
        """
        Ensure we can create a new batch object.
        """
        url = "/api/v1/pcr/batches/"
        data = {
            "kind_id": self.kind.id,
            "analysis_id": self.analysis.id,
            "device_id": self.device.id,
            "created_by": "Test User",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Batch.objects.count(), 1)
        self.assertEqual(Batch.objects.get().kind_id, self.kind.id)
        self.assertEqual(Batch.objects.get().analysis_id, self.analysis.id)
        self.assertEqual(Batch.objects.get().device_id, self.device.id)
        self.assertEqual(Batch.objects.get().created_by, "Test User")

    def test_create_batch_with_invalid_kind_id(self):
        """
        Ensure we can't create a new batch object with an invalid kind_id.
        """
        url = "/api/v1/pcr/batches/"
        data = {
            "kind_id": 999,
            "analysis_id": self.analysis.id,
            "device_id": self.device.id,
            "created_by": "Test User",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Batch.objects.count(), 0)

    def test_create_batch_with_invalid_analysis_id(self):
        """
        Ensure we can't create a new batch object with an invalid analysis_id.
        """
        url = "/api/v1/pcr/batches/"
        data = {
            "kind_id": self.kind.id,
            "analysis_id": 999,
            "device_id": self.device.id,
            "created_by": "Test User",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Batch.objects.count(), 0)

    def test_create_batch_with_invalid_device_id(self):
        """
        Ensure we can't create a new batch object with an invalid device_id.
        """
        url = "/api/v1/pcr/batches/"
        data = {
            "kind_id": self.kind.id,
            "analysis_id": self.analysis.id,
            "device_id": 999,
            "created_by": "Test User",
        }
        response = self.client.post(url, data, format="json")
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
            created_by="Test User",
        )
        url = f"/api/v1/pcr/batches/{batch.id}/"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Batch.objects.count(), 0)

    def test_delete_batch_with_invalid_id(self):
        """
        Ensure we can't delete a batch object with an invalid id.
        """
        url = "/api/v1/pcr/batches/999/"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(Batch.objects.count(), 0)


class ReagentAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            identifier="testuser", password="testpass", email="test@example.com"
        )
        self.user.groups.create(name="PCR")

        self.client.force_authenticate(user=self.user)

        self.kind = Kind.objects.create(
            name="Kontrolle",
        )
        self.analysis = Analysis.objects.create(
            name="ANA1",
        )
        self.device = Device.objects.create(
            name="Device 1",
        )
        self.batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by="Test User",
        )

    def test_create_reagent(self):
        """
        Ensure we can create a new reagent object.
        """
        url = "/api/v1/pcr/reagents/"
        data = {
            "id": "Reagent1",
            "initial_amount": 10,
            "created_by": "Test User",
            "batch_id": self.batch.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Reagent.objects.count(), 1)
        self.assertEqual(Reagent.objects.get().id, "Reagent1")
        self.assertEqual(Reagent.objects.get().batch_id, self.batch.id)

    def test_create_reagent_with_invalid_batch_id(self):
        """
        Ensure we can't create a new reagent object with an invalid batch_id.
        """
        url = "/api/v1/pcr/reagents/"
        data = {
            "id": "Reagent1",
            "initial_amount": 10,
            "created_by": "Test User",
            "batch_id": 999,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Reagent.objects.count(), 0)

    def test_delete_reagent(self):
        """
        Ensure we can delete a reagent object.
        """
        reagent = Reagent.objects.create(
            id="Reagent 1",
            initial_amount=10,
            batch=self.batch,
            created_by="Test User",
        )
        url = f"/api/v1/pcr/reagents/{reagent.id}/"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Reagent.objects.count(), 0)

    def test_delete_reagent_with_invalid_id(self):
        """
        Ensure we can't delete a reagent object with an invalid id.
        """
        url = "/api/v1/pcr/reagents/999/"
        response = self.client.delete(url, format="json")
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
            created_by="Test User",
        )
        reagent = Reagent.objects.create(
            id="Reagent 1",
            initial_amount=10,
            batch=batch,
            created_by="Test User",
        )
        url = f"/api/v1/pcr/batches/?search={reagent.id}"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["results"][0]["id"], str(batch.id))

    def test_search_no_reagents(self):
        """
        Ensure we can search for a batch with no reagents.
        """
        batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by="Test User",
        )
        url = f"/api/v1/pcr/batches/?search={batch.id}"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 0)

    def test_search_empty_reagents(self):
        """
        Ensure we can search for a batch with empty reagents.
        """
        batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by="Test User",
        )
        reagent = Reagent.objects.create(
            id="Reagent 1",
            # is_empty should be automatically set to True
            initial_amount=0,
            batch=batch,
            created_by="Test User",
        )
        url = f"/api/v1/pcr/batches/?search={reagent.id}&reagents__is_empty=true"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["results"][0]["id"], str(batch.id))

        url = f"/api/v1/pcr/batches/?search={reagent.id}&reagents__is_empty=false"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 0)

    def test_removal_set_empty_on_reagent(self):
        """
        Ensure that creation of removal sets the reagent to is_empty.
        And that deletion of removal sets the reagent to not is_empty.
        """
        batch = Batch.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            device=self.device,
            created_by="Test User",
        )
        reagent = Reagent.objects.create(
            id="Reagent 1",
            initial_amount=10,
            batch=batch,
            created_by="Test User",
        )
        removal = Removal.objects.create(
            reagent=reagent,
            amount=10,
            created_by="Test User",
        )
        removal.save()
        self.assertEqual(reagent.is_empty, True)

        removal.delete()
        self.assertEqual(reagent.is_empty, False)


class AmountTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            identifier="testuser", password="testpass", email="test@example.com"
        )
        self.user.groups.create(name="PCR")

        self.client.force_authenticate(user=self.user)

        self.kind = Kind.objects.create(
            name="Kontrolle",
        )

        self.analysis = Analysis.objects.create(
            name="ANA1",
        )

        self.dummy_amount = Amount.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            value=10,
        )

    def test_get_amount(self):
        """
        Ensure we can get an amount.
        """
        url = f"/api/v1/pcr/amounts/{self.dummy_amount.id}/"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["value"], 10)

    def test_filter_amount(self):
        """Ensure we can filter the amounts by kind and analysis"""
        # create another amount
        other_kind = Kind.objects.create(
            name="Standard",
        )

        other_analysis = Analysis.objects.create(
            name="ANA2",
        )

        _ = Amount.objects.create(
            kind=other_kind,
            analysis=other_analysis,
            value=20,
        )

        # check if all amounts are returned
        url = "/api/v1/pcr/amounts/"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            len(response.data["results"]), 22
        )  # 22 because of the initial amounts

        # check if only the amounts with the correct kind are returned
        url = f"/api/v1/pcr/amounts/?kind={self.kind.id}&analysis={self.analysis.id}"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["results"][0]["value"], 10)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["kind"], self.kind.id)
        self.assertEqual(response.data["results"][0]["analysis"], self.analysis.id)
        self.assertEqual(response.data["results"][0]["id"], str(self.dummy_amount.id))


class RecRemovalCountsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            identifier="testuser", password="testpass", email="test@example.com"
        )
        self.user.groups.create(name="PCR")

        self.client.force_authenticate(user=self.user)

        self.kind = Kind.objects.create(
            name="Kontrolle",
        )

        self.analysis = Analysis.objects.create(
            name="ANA1",
        )

        self.dummy_rec_removal_count = RecRemovalCounts.objects.create(
            kind=self.kind,
            analysis=self.analysis,
            value=10,
        )

    def test_get_rec_removal_count(self):
        """
        Ensure we can get an rec_removal_count.
        """
        url = f"/api/v1/pcr/recommended_removals/{self.dummy_rec_removal_count.id}/"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["value"], 10)

    def test_filter_rec_removal_count(self):
        """Ensure we can filter the recommended_removals by kind and analysis"""
        # create another rec_removal_count
        other_kind = Kind.objects.create(
            name="Standard",
        )

        other_analysis = Analysis.objects.create(
            name="ANA2",
        )

        _ = RecRemovalCounts.objects.create(
            kind=other_kind,
            analysis=other_analysis,
            value=20,
        )

        # check if all recommended_removals are returned
        url = "/api/v1/pcr/recommended_removals/"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            len(response.data["results"]), 6
        )  # 6 because of the initial amounts

        # check if only the recommended_removals with the correct kind are returned
        url = f"/api/v1/pcr/recommended_removals/?kind={self.kind.id}&analysis={self.analysis.id}"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["results"][0]["value"], 10)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["kind"], self.kind.id)
        self.assertEqual(response.data["results"][0]["analysis"], self.analysis.id)
        self.assertEqual(
            response.data["results"][0]["id"], str(self.dummy_rec_removal_count.id)
        )
