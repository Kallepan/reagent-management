# Reagent Management System

A system which keeps track of the reagents in the laboratory.

## Departments

### Bak

Simple storage system which keeps track of locations, the type of the reagent, as well as the lot number. Each lot can be present as multiple crates which are stored in different locations. Each crate can have a different amount of reagent. Each crate group has a unique composite key made up of the type of the reagent, location, lot which is used to uniquely identify it. Each create group has a coutner associated with it which tracks the number of crates in the group.

### PCR

PCR keeps track of the reagents used in Ingenious devices. Each reagent is created in a batch and each batch has a unique ID. The batch keeps track of the device, analysis and type of reagent stored. On the other hand, each reagent has an initial_amount and a dynamically calculated amount which is updated as the user creates 'revmovals' of a reagent. Each removal has a unique ID and keeps track of the amount removed, the date of removal and the user who removed it in addition to a simple comment. The amount of reagent in a batch is calculated by subtracting the sum of all removals from the initial_amount. The amount is also dynamically kept track of and returned by the Batch (sum of all initial_amounts of reagents in the batch - sum of all removals of reagents in the batch).
