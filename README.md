# Reagent Management System

A system which keeps track of the reagents in the laboratory.

## Departments

### Bak

Simple storage system which keeps track of locations, the type of the reagent, as well as the lot number. Each lot can be present as multiple crates which are stored in different locations. Each crate can have a different amount of reagent. Each crate group has a unique composite key made up of the type of the reagent, location, lot which is used to uniquely identify it. Each create group has a coutner associated with it which tracks the number of crates in the group.

#### Documentation

- How to add a Location:
  - Go to the admin page
  - Click on the 'Locations' link
  - Click on the 'Add Location' button
  - Fill in the form (name is necessary) and click save

- How to add a new producer:
  - Go to the admin page
  - Click on the 'Types' link
  - Click on the 'Add Producer' button
  - Fill in the form (article number, name of the product and producer name are necessary) and click save

#### BAK Database Model

```dbdiagram.io
Table Location {
  id uuid
  name varchar

  created_at timestamp
}

Table Type {
  id uuid
  name varchar
  producer varchar

  article_number varchar
  created_at timestamp
}

Table Lot {
  id uuid
  name varchar

  type uuid

  valid_from date
  valid_until date

  created_at timestamp
  created_by varchar

  in_use_from date
  in_use_until date

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

Ref: "Type"."id" < "Lot"."type"
Ref: "Location"."id" < "Reagent"."location"
Ref: "Lot"."id" < "Reagent"."lot"
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
