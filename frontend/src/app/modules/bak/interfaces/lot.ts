import { BakType } from './type';
import { BakLocation } from './location';

export interface BakLot {
  id: string;
  name: string;
  type: BakType;

  reagents: BakLotReagent[];

  valid_from: string | null;
  valid_until: string;

  created_at: string;
  created_by: string;

  totalAmount: number;
}

export interface BakLotReagent {
  id: string;
  location: BakLocation;

  created_at: string;
  created_by: string;

  amount: number;
}

// Post data
export interface CreateBakLot {
  name: string;
  created_by: string;
  valid_from: string | null;
  valid_until: string;
  type_id: string;
}
