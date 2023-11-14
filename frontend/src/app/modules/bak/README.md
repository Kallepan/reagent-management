# Bak Module

## Description

The bak reagent app keeps track of lots. Each lot can be present in one or more locations (called reagent) which have a certain amount. The app keeps track of the amount of each lot in each location. Furthermore each lot is of a certain type. A type is defined as a tuple of article_number, name, and producer.
A simple CRU(D) API exists to manage lots and reagents. Types and location can only be managed by the admin user.
