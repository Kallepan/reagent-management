# Reagent Management System

A system which keeps track of the reagents in the laboratory.

## Departments

### Bak

Simple storage system which keeps track of locations, the type of the reagent, as well as the lot number.
Each lot can be present as multiple crates which are stored in different locations. Each crate can have a different amount of reagent.
Each crate group has a unique composite key made up of the type of the reagent, location, lot which is used to uniquely identify it.
Each create group has a coutner associated with it which tracks the number of crates in the group.
