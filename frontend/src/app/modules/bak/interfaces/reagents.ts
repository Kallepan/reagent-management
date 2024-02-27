/* I created a separate interface for reagents, because I wanted to use it in a different context. */
import { BakLocation } from './location';

export interface BakReagent {
  id: string;
  created_by: string;
  created_at: string;

  location: BakLocation;
  lot: {
    id: string;
    name: string;
    type: string;
    valid_from: string | null;
    valid_until: string;
    is_empty: boolean;
  };

  amount: number;
}
