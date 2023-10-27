from django.contrib.auth import get_user_model
from django.test import TestCase

class UsersManagersTests(TestCase):

    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            identifier='testuser',
            email='testuser@example.com',
            password='testpass123'
        )
        self.assertEqual(user.identifier, 'testuser')
        self.assertEqual(user.email, 'testuser@example.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_admin)

        try:
            self.assertIsNone(user.username)
        except AttributeError:
            pass

        with self.assertRaises(TypeError):
            User.objects.create_user()
        with self.assertRaises(TypeError):
            User.objects.create_user(email="")
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", identifier="", password="foo")

    def test_create_superuser(self):
        User = get_user_model()
        admin_user = User.objects.create_superuser(
            identifier='superadmin',
            email='superadmin@example.com',
            password='superpass123'
        )

        self.assertEqual(admin_user.identifier, 'superadmin')
        self.assertEqual(admin_user.email, 'superadmin@example.com')
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_admin)

        try:
            self.assertIsNone(admin_user.username)
        except AttributeError:
            pass

        # Should not be able to create a superuser without is_admin=True
        second_user = User.objects.create_superuser(
            identifier='superadmin2',
            email='superadmin2@example.com',
            password='superpass123',
            is_admin=False
        )
        self.assertTrue(second_user.is_admin)

        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                identifier='superadmin3',
                email='superadmin3@example.com',
                password='',
            )

        