import { Analysis, Device, Kind } from "./simple";
import { Removal } from "./removal";

// Basic Reagent
export interface Reagent {
    id: string;
    initial_amount: number;

    removals: Removal[];
}

// Batch is a group of reagents
export interface Batch {
    id: string;

    kind: Kind;
    analysis: Analysis;
    Device: Device;

    reagents: Reagent[];
}

// CreateReagent is used to create a new reagent
export interface CreateReagent {
    id: string;
    initial_amount: number;
}