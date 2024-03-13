# Reagent Management System

A system which keeps track of the reagents in the laboratory.

## Departments

### Bak

#### Database Schema Overview

The database schema embodies a straightforward storage system tailored for managing various aspects of reagent storage. It organizes data into several interconnected tables, facilitating the tracking of locations, reagent types, producers, products, lots, and reagents.

#### Tables Overview

- **Location**: Stores information about different storage locations.
- **Type**: Represents various types of reagents.
- **Producer**: Contains details about the producers of reagents.
- **Product**: Describes individual reagent products, including their producers, types, and article numbers.
- **Lot**: Manages lots of reagents, including validity dates and creation metadata.
- **Reagent**: Tracks individual crates of reagents, including their amounts, creation metadata, and empty status.

#### Relationships Overview

- **Product to Lot**: Products are associated with multiple lots.
- **Location to Reagent**: Locations can accommodate multiple crates of reagents.
- **Lot to Reagent**: Each lot can encompass multiple crates of reagents.
- **Type to Product**: Products are classified under specific reagent types.
- **Producer to Product**: Producers are linked to the products they manufacture.

This schema streamlines the organization and tracking of reagent storage, allowing efficient management of inventory across different locations and lot configurations. Additionally, it provides insights into production and type classifications for enhanced data analysis and management.

#### Documentation

- How to add a Location:

  - Go to the admin page
  - Click on the 'Locations' link
  - Click on the 'Add Location' button
  - Fill in the form (name is necessary) and click save

- How to add a new product:
  - Go to the admin page
  - Click on the 'Types' link
  - Click on the 'Add Producer' button
  - Fill in the form (article number, name of the product and producer name are necessary) and click save

#### BAK Database Model

```DBML
Table Location {
  id uuid
  name varchar

  created_at timestamp
}

Table Type {
  id uuid
  name varchar
}

Table Producer {
  id uuid
  name varchar
}

Table Product {
  id uuid
  name varchar
  producer uuid
  type uuid

  article_number varchar
  created_at timestamp
}

Table Lot {
  id uuid
  name varchar

  product uuid

  valid_from date
  valid_until date

  created_at timestamp
  created_by varchar

  is_empty boolean [note: 'calculated field']
}

Table Reagent {
  id uuid
  location uuid
  lot uuid

  amount integer

  created_at timestamp
  created_by varchar

  is_empty boolean [note: 'calculated field']
}

Ref: "Product"."id" < "Lot"."product"
Ref: "Location"."id" < "Reagent"."location"
Ref: "Lot"."id" < "Reagent"."lot"
Ref: "Type"."id" < "Product"."type"
Ref: "Producer"."id" < "Product"."producer"
```

### PCR

PCR keeps track of the reagents used in Ingenious devices. Each reagent is created in a batch and each batch has a unique ID. The batch keeps track of the device, analysis and type of reagent stored. On the other hand, each reagent has an initial_amount and a dynamically calculated amount which is updated as the user creates 'revmovals' of a reagent. Each removal has a unique ID and keeps track of the amount removed, the date of removal and the user who removed it in addition to a simple comment. The amount of reagent in a batch is calculated by subtracting the sum of all removals from the initial_amount. The amount is also dynamically kept track of and returned by the Batch (sum of all initial_amounts of reagents in the batch - sum of all removals of reagents in the batch).

#### PCR Database Model

```dbdiagram.io
Table Kind {
  id uuid
  name varchar [note: 'Kontrolle,Standard,Mastermix']
}

Table Batch {
  id uuid

  kind uuid
  analysis uuid
  device uuid

  comment varchar
}

Table Device {
  id uuid
  name varchar
}

Table Analysis {
  id uuid
  name varchar
}

Table Reagent {
  id varchar [note: 'This field is filled in by the user']

  is_empty boolean [note: 'autocalculated before save']
  batch uuid

  initial_amount integer
  current_amount integer [note: 'calculated field']
}

Table Removal {
  id uuid

  reagent uuid
  amount integer
}

Table Amount {
  id uuid
  kind uuid
  analysis uuid

  amount integer

  note: 'This table keeps track of the default amounts associated with each analysis and kind'
}


Ref: "Batch"."id" < "Reagent"."batch"
Ref: "Kind"."id" < "Batch"."kind"
Ref: "Device"."id" < "Batch"."device"
Ref: "Analysis"."id" < "Batch"."analysis"
Ref: "Reagent"."id" < "Removal"."reagent"
Ref: "Kind"."id" < "Amount"."kind"
Ref: "Analysis"."id" < "Amount"."analysis"
```
