import { CreationType } from "./base";
import { Removal } from "./removal";
import { Analysis, Device, Kind } from "./simple";

// Basic Reagent
export interface Reagent extends CreationType {
    id: string;
    initial_amount: number;
    current_amount: number;

    removals: Removal[];
}

// Batch is a group of reagents
export interface Batch extends CreationType {
    id: string;

    kind: Kind;
    analysis: Analysis;
    device: Device;

    // sum of all reagents as returned by the backend
    initial_amount: number;
    current_amount: number;

    reagents: Reagent[];
}

export interface CreateBatch {
    kind_id: string;
    analysis_id: string;
    device_id: string;
    comment: string;
    created_by: string;
}

// CreateReagent is used to create a new reagent
export interface CreateReagent {
    batch_id: string;
    id: string;
    initial_amount: number;
    created_by: string;
}