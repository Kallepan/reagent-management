import { BakType } from "./type";
import { BakLocation } from "./location";

export interface BakLot {
    id: string;
    name: string;
    type: BakType;

    reagents: BakLotReagent[];

    valid_from: string|null;
    valid_until: string;

    created_at: string;
    created_by: string;

    in_use_from: string|null;
    in_use_until: string|null;
};

export interface BakLotReagent {
    id: string,
    location: BakLocation,

    created_at: string,
    created_by: string,

    amount: number,
}

// Post data
export interface CreateBakLot {
    name: string;
    created_by: string;
    valid_from: string|null;
    valid_until: string;
    in_use_from: string|null;
    in_use_until: string|null;
    type_id: string;
  }
