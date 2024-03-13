import { BakLocation } from './location';
import { Product } from './type';

export interface BakLot {
  id: string;
  name: string;
  product: Product;

  reagents: BakLotReagent[];

  valid_from: string | null;
  valid_until: string;

  created_at: Date;
  created_by: string;

  totalAmount: number;
}

export interface BakLotReagent {
  id: string;
  location: BakLocation;

  created_at: Date;
  created_by: string;

  amount: number;
}

// Post data
export interface CreateBakLot {
  name: string;
  created_by: string;
  valid_from: string | null;
  valid_until: string;
  product_id: string;
}
