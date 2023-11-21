import { BaseType } from "./base";

// Keeps track of the different analyses
export interface Analysis extends BaseType {
}

// This is the type but I called it kind because type is a reserved word in typescript
export interface Kind extends BaseType {
    // Standard, Kontrolle, Mastermix
}

// Keeps track of devices such as InGenius
export interface Device extends BaseType {

}