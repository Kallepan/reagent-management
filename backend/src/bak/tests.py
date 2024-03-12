from django.test import TestCase
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient

from .models import ProductType, ProductProducer, Product, Lot, Reagent, Location

import logging


class PermissionsTest(TestCase):
    """Test the user model using the APIClient"""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create(
            identifier="testuser", email="testuser@example.com", password="testpass123"
        )

        type = ProductType.objects.create(name="Test Type")
        producer = ProductProducer.objects.create(name="Test Producer")
        self.product = Product.objects.create(
            name="Test Product", type=type, producer=producer
        )

    def test_permissions(self):
        data = {
            "name": "Test Lot 2",
            "valid_until": "2021-12-31",
            "created_by": "Test User",
            "product_id": self.product.id,
        }

        # try to post to the api without authentication
        response = self.client.post("/api/v1/bak/lots/", data=data, format="json")
        self.assertEqual(response.status_code, 401)

        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/v1/bak/lots/", data=data, format="json")
        self.assertEqual(response.status_code, 403)

        self.user.groups.create(name="BAK")

        # try to post to the api with authentication
        response = self.client.post("/api/v1/bak/lots/", data=data, format="json")
        self.assertEqual(response.status_code, 201)


class LotTest(TestCase):
    """Test the lot model using the APIClient"""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create(
            identifier="testuser", email="testuser@example.com", password="testpass123"
        )

        self.user.groups.create(name="BAK")

        self.client.force_authenticate(user=self.user)

    def test_get_lots(self):
        response = self.client.get("/api/v1/bak/lots/")
        self.assertEqual(response.status_code, 200)

        data = response.data["results"]
        self.assertEqual(len(data), 0)

    def test_is_empty_filter(self):
        type = ProductType.objects.create(name="Test Type")
        producer = ProductProducer.objects.create(name="Test Producer")

        product = Product.objects.create(
            name="Test Product", type=type, producer=producer
        )
        loc = Location.objects.create(name="Test Location")

        # get empty
        response = self.client.get("/api/v1/bak/lots/?is_empty=true")
        self.assertEqual(response.status_code, 200)
        data = response.data["results"]
        self.assertEqual(len(data), 0)

        lot_two = Lot.objects.create(
            name="Test Lot 2",
            valid_until="2021-12-31",
            created_by="Test User",
            product=product,
        )
        lot_three = Lot.objects.create(
            name="Test Lot 3",
            valid_until="2021-12-31",
            created_by="Test User",
            product=product,
        )
        lot_four = Lot.objects.create(
            name="Test Lot 4",
            valid_until="2021-12-31",
            created_by="Test User",
            product=product,
        )
        lot_two.reagents.create(amount=0, created_by=self.user, location=loc)

        # get empty
        response = self.client.get("/api/v1/bak/lots/?is_empty=true")
        self.assertEqual(response.status_code, 200)
        data = response.data["results"]
        self.assertEqual(len(data), 3)

        # get not empty
        response = self.client.get("/api/v1/bak/lots/?is_empty=false")
        self.assertEqual(response.status_code, 200)
        data = response.data["results"]
        self.assertEqual(len(data), 0)

        lot_three.reagents.create(amount=20, created_by=self.user, location=loc)
        # get empty
        response = self.client.get("/api/v1/bak/lots/?is_empty=true")
        self.assertEqual(response.status_code, 200)
        data = response.data["results"]

        self.assertEqual(len(data), 2)

        # get not empty
        response = self.client.get("/api/v1/bak/lots/?is_empty=false")
        self.assertEqual(response.status_code, 200)
        data = response.data["results"]
        self.assertEqual(len(data), 1)

    def test_get_specific_lot(self):
        type = ProductType.objects.create(name="Test Type")
        producer = ProductProducer.objects.create(name="Test Producer")
        product = Product.objects.create(
            name="Test Product", type=type, producer=producer
        )
        lot = Lot.objects.create(
            name="Test Lot",
            valid_until="2021-12-31",
            created_by="Test User",
            product=product,
        )

        response = self.client.get(f"/api/v1/bak/lots/{lot.id}/")
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertEqual(data["name"], lot.name)
        self.assertEqual(data["valid_until"], lot.valid_until)
        self.assertEqual(data["created_by"], lot.created_by)

        self.assertEqual(data["product"]["id"], str(product.id))

        self.assertIn("is_empty", data)

    def test_delete_lot(self):
        type = ProductType.objects.create(name="Test Type")
        producer = ProductProducer.objects.create(name="Test Producer")
        product = Product.objects.create(
            name="Test Product", type=type, producer=producer
        )
        lot = Lot.objects.create(
            name="Test Lot",
            valid_until="2021-12-31",
            valid_from="2020-01-14",
            created_by="Test User",
            product=product,
        )

        response = self.client.delete(f"/api/v1/bak/lots/{lot.id}/")
        self.assertEqual(response.status_code, 204)

        # check if lot was deleted
        response = self.client.get(f"/api/v1/bak/lots/{lot.id}/")
        self.assertEqual(response.status_code, 404)

    def test_update_lot(self):
        type = ProductType.objects.create(name="Test Type")
        producer = ProductProducer.objects.create(name="Test Producer")
        product = Product.objects.create(
            name="Test Product", type=type, producer=producer
        )
        lot = Lot.objects.create(
            name="Test Lot",
            valid_until="2021-12-31",
            created_by="Test User",
            product=product,
        )

        test_cases = [
            {
                # 'Invalid type',
                "status_code": 400,
                "data": {
                    "valid_until": "2021-12-31",
                    "created_by": "Test User",
                    "product_id": "Test Product",
                },
            },
            {
                # valid_from is after valid_until
                "status_code": 400,
                "data": {
                    "valid_from": "2021-12-31",
                    "valid_until": "2021-12-30",
                    "created_by": "Test User",
                },
            },
            {
                # valid_from is after valid_until
                "status_code": 400,
                "data": {
                    "valid_from": "2023-01-12",
                    "created_by": "Test User",
                },
            },
        ]

        for i, step in enumerate(test_cases):
            logging.debug(f"Update Lot. Step: {i}")
            response = self.client.patch(
                f"/api/v1/bak/lots/{lot.id}/", data=step["data"], format="json"
            )

            self.assertEqual(response.status_code, step["status_code"])

    def test_create_lot(self):
        type = ProductType.objects.create(name="Test Type")
        producer = ProductProducer.objects.create(name="Test Producer")
        product = Product.objects.create(
            name="Test Product", type=type, producer=producer
        )

        # test the creation of a lot
        test_steps = [
            {
                # 'Invalid type',
                "status_code": 400,
                "data": {
                    "name": "Test Lot",
                    "valid_until": "2021-12-31",
                    "created_by": "Test User",
                    "product_id": "Test-Type",
                },
            },
            {
                # 'Invalid data',
                "status_code": 400,
                "data": {
                    "name": None,
                    "valid_until": "2021-12-31",
                    "created_by": "Test User",
                    "product_id": product.id,
                },
            },
            {
                # 'Lot created successfully',
                "status_code": 201,
                "data": {
                    "name": "Test Lot 2",
                    "valid_until": "2021-12-31",
                    "created_by": "Test User",
                    "product_id": product.id,
                },
            },
            {
                # 'Lot with this name and type already exists',
                "status_code": 400,
                "data": {
                    "name": "Test Lot 2",
                    "valid_until": "2021-12-31",
                    "created_by": "Test User",
                    "product_id": product.id,
                },
            },
            {
                # 'Invalid valid_until and valid_from',
                "status_code": 400,
                "data": {
                    "name": "Test Lot 3",
                    "valid_from": "2021-12-31",
                    "valid_until": "2021-12-30",
                    "created_by": "Test User",
                    "product_id": product.id,
                },
            },
        ]

        for i, step in enumerate(test_steps):
            logging.debug(f"Step: {i}")

            response = self.client.post(
                "/api/v1/bak/lots/", data=step["data"], format="json"
            )

            self.assertEqual(response.status_code, step["status_code"])


class LocationTest(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.location_one = Location.objects.create(name="Test Location 1")
        self.location_two = Location.objects.create(name="Test Location 2")

    def test_get_location(self):
        response = self.client.get("/api/v1/bak/locations/")
        self.assertEqual(response.status_code, 200)

        data = response.data["results"]
        self.assertEqual(len(data), 2)

    def test_get_specific_location(self):
        response = self.client.get(f"/api/v1/bak/locations/{self.location_one.id}/")
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertEqual(data["name"], self.location_one.name)


class LotReagentTestCase(TestCase):
    """This test should determine wether all reagents are sorted correctly"""

    def setUp(self) -> None:
        self.client = APIClient()

        # create dummy user
        User = get_user_model()
        self.user = User.objects.create(
            identifier="testuser", email="test@example.com", password="testpass123"
        )

        self.group = self.user.groups.create(name="BAK")

        self.client.force_authenticate(user=self.user)

    def test_lot_reagent(self):
        # create dummy type
        producer = ProductProducer.objects.create(name="Test Producer")
        type = ProductType.objects.create(name="Test Type")
        product = Product.objects.create(
            name="Test Product", type=type, producer=producer
        )

        # create dummy lot
        lot = Lot.objects.create(
            name="Test Lot",
            valid_until="2021-12-31",
            created_by="Test User",
            product=product,
        )

        # create dummy location
        location_one = Location.objects.create(name="Test Location")
        location_two = Location.objects.create(name="Test Location 2")
        location_three = Location.objects.create(name="Test Location 3")
        location_four = Location.objects.create(name="Test Location 4")

        # create dummy reagents
        reagent_one = Reagent.objects.create(
            lot=lot, location=location_one, created_by="TEST", amount=10
        )
        Reagent.objects.create(
            lot=lot, location=location_two, created_by="TEST", amount=20
        )
        Reagent.objects.create(
            lot=lot, location=location_three, created_by="TEST", amount=30
        )
        Reagent.objects.create(
            lot=lot, location=location_four, created_by="TEST", amount=40
        )

        response = self.client.get(f"/api/v1/bak/lots/{lot.id}/")
        self.assertEqual(response.status_code, 200)

        # check if reagents are sorted by name
        data = response.data
        self.assertEqual(data["reagents"][0]["location"]["name"], "Test Location")
        self.assertEqual(data["reagents"][1]["location"]["name"], "Test Location 2")
        self.assertEqual(data["reagents"][2]["location"]["name"], "Test Location 3")
        self.assertEqual(data["reagents"][3]["location"]["name"], "Test Location 4")

        # update one reagent and check if it is sorted correctly
        reagent_one.amount = 50
        reagent_one.save()

        response = self.client.get(f"/api/v1/bak/lots/{lot.id}/")
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertEqual(data["reagents"][0]["location"]["name"], "Test Location")
        self.assertEqual(data["reagents"][1]["location"]["name"], "Test Location 2")
        self.assertEqual(data["reagents"][2]["location"]["name"], "Test Location 3")
        self.assertEqual(data["reagents"][3]["location"]["name"], "Test Location 4")


class ReagentTest(TestCase):
    def setUp(self) -> None:
        producer_one = ProductProducer.objects.create(name="Test Producer 1")
        producer_two = ProductProducer.objects.create(name="Test Producer 2")

        type_one = ProductType.objects.create(name="Test Type 1")
        type_two = ProductType.objects.create(name="Test Type 2")

        # create dummy type
        self.product_one = Product.objects.create(
            name="Test Product 1", type=type_one, producer=producer_one
        )
        self.product_two = Product.objects.create(
            name="Test Product 2", type=type_two, producer=producer_two
        )

        # create dummy lot
        self.lot = Lot.objects.create(
            name="Test Lot",
            valid_until="2021-12-31",
            created_by="Test User",
            product=self.product_one,
        )
        self.lot_two = Lot.objects.create(
            name="Test Lot 2",
            valid_until="2021-12-31",
            created_by="Test User",
            product=self.product_two,
        )

        # create dummy location
        self.location = Location.objects.create(name="Test Location")
        self.location_two = Location.objects.create(name="Test Location 2")

        # create dummy reagent
        self.reagent = Reagent.objects.create(
            lot=self.lot, location=self.location, created_by="Test User"
        )

        self.client = APIClient()

        # create dummy user
        User = get_user_model()
        self.user = User.objects.create(
            identifier="testuser", email="test@example.com", password="testpass123"
        )
        self.group = self.user.groups.create(name="BAK")

        self.client.force_authenticate(user=self.user)

    def test_get_reagents(self):
        # Check if one reagent is returned
        response = self.client.get("/api/v1/bak/reagents/")

        self.assertEqual(response.status_code, 200)
        data = response.data["results"]
        self.assertEqual(len(data), 1)

        # Check if multiple reagents are returned
        _ = Reagent.objects.create(
            lot=self.lot_two, location=self.location_two, created_by=self.user
        )
        response = self.client.get("/api/v1/bak/reagents/")
        self.assertEqual(response.status_code, 200)

        data = response.data["results"]
        self.assertEqual(len(data), 2)

    def test_get_specific_reagent(self):
        response = self.client.get(f"/api/v1/bak/reagents/{self.reagent.id}/")
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertEqual(data["location"]["id"], str(self.reagent.location.id))
        self.assertEqual(data["created_by"], str(self.reagent.created_by))

    def test_update_reagent(self):
        test_steps = [
            {
                # 'Invalid lot',
                "status_code": 400,
                "data": {
                    "lot_id": "Test Lot",
                    "location_id": self.location.id,
                    "created_by": self.user.identifier,
                },
            },
            {
                # 'Invalid location',
                "status_code": 400,
                "data": {
                    "lot_id": self.lot.id,
                    "location_id": "Test Location",
                    "created_by": self.user.identifier,
                },
            },
            {
                # 'Invalid created_by',
                "status_code": 400,
                "data": {
                    "lot_id": self.lot.id,
                    "location_id": self.location.id,
                    "created_by": "Test User",
                },
            },
            {
                # 'Invalid data',
                "status_code": 400,
                "data": {"lot": None, "location": None, "created_by": None},
            },
            {
                # 'Reagent updated successfully',
                "status_code": 200,
                "data": {
                    "amount": 10,
                },
            },
        ]

        for i, step in enumerate(test_steps):
            logging.debug(f"Update Reagent. Step: {i}")

            response = self.client.patch(
                f"/api/v1/bak/reagents/{self.reagent.id}/",
                data=step["data"],
                format="json",
            )
            self.assertEqual(response.status_code, step["status_code"])

    def test_create_reagent(self):
        test_steps = [
            {
                # 'Invalid lot and location',
                "status_code": 400,
                "data": {
                    "lot_id": "Test Lot",
                    "location_id": "Test Location",
                    "created_by": "Test User",
                },
            },
            {
                # 'Invalid data',
                "status_code": 400,
                "data": {"lot_id": None, "location_id": None, "created_by": None},
            },
            {
                # 'Reagent with this lot and location already exists',
                "status_code": 400,
                "data": {
                    "lot_id": self.lot.id,
                    "location_id": self.location.id,
                    "created_by": self.user.identifier,
                },
            },
            {
                # 'Reagent created successfully',
                "status_code": 201,
                "data": {
                    "lot_id": self.lot_two.id,
                    "location_id": self.location_two.id,
                    "created_by": self.user.identifier,
                },
            },
        ]

        for i, step in enumerate(test_steps):
            logging.debug(f"Create Reagent. Step: {i}")
            response = self.client.post(
                "/api/v1/bak/reagents/", data=step["data"], format="json"
            )
            self.assertEqual(response.status_code, step["status_code"])


class ProductTest(TestCase):
    """Test the type model using the APIClient"""

    def setUp(self):
        self.client = APIClient()

    def test_get_types(self):
        response = self.client.get("/api/v1/bak/products/")
        self.assertEqual(response.status_code, 200)

        data = response.data["results"]

        self.assertEqual(len(data), 0)

        producer_one = ProductProducer.objects.create(name="Test Producer 1")
        procuer_two = ProductProducer.objects.create(name="Test Producer 2")
        type_one = ProductType.objects.create(name="Test Type 1")
        type_two = ProductType.objects.create(name="Test Type 2")

        product_one = Product.objects.create(
            name="Test Product 1", type=type_one, producer=producer_one
        )
        product_two = Product.objects.create(
            name="Test Product 2", type=type_two, producer=procuer_two
        )

        response = self.client.get("/api/v1/bak/products/")
        self.assertEqual(response.status_code, 200)

        data = response.data["results"]

        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["name"], product_one.name)
        self.assertEqual(data[0]["producer"]["name"], product_one.producer.name)
        self.assertEqual(data[0]["producer"]["id"], str(product_one.producer.id))
        self.assertEqual(data[0]["type"]["name"], product_one.type.name)
        self.assertEqual(data[0]["type"]["id"], str(product_one.type.id))
        self.assertEqual(data[1]["name"], product_two.name)
        self.assertEqual(data[1]["producer"]["name"], product_two.producer.name)
        self.assertEqual(data[1]["producer"]["id"], str(product_two.producer.id))
        self.assertEqual(data[1]["type"]["name"], product_two.type.name)
        self.assertEqual(data[1]["type"]["id"], str(product_two.type.id))

    def test_get_specific_type(self):
        type = ProductType.objects.create(name="Test Type")
        producer = ProductProducer.objects.create(name="Test Producer")

        product = Product.objects.create(
            name="Test Product", type=type, producer=producer
        )
        response = self.client.get(f"/api/v1/bak/products/{product.id}/")
        self.assertEqual(response.status_code, 200)

        data = response.data

        self.assertEqual(data["name"], product.name)
        self.assertEqual(data["producer"]["name"], product.producer.name)
        self.assertEqual(data["producer"]["id"], str(product.producer.id))
        self.assertEqual(data["type"]["name"], product.type.name)
        self.assertEqual(data["type"]["id"], str(product.type.id))
