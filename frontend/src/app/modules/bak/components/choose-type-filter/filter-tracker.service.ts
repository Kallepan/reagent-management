import { Injectable, WritableSignal, signal } from '@angular/core';
import { BakLot } from '../../interfaces/lot';
export type ProductTypeFilterToBeChosen = {
  // for filtering
  id: string;
  // for display
  name: string;

  checked: boolean;
};

@Injectable({
  providedIn: null,
})
export class FilterTrackerService {
  toggleFilter(filter: ProductTypeFilterToBeChosen) {
    const newFilters = this._productTypesToBeFilteredOut().map((f) => {
      if (f.id === filter.id) {
        f.checked = !f.checked;
      }
      return f;
    });
    this._productTypesToBeFilteredOut.set(newFilters);
  }

  private _productTypesToBeFilteredOut: WritableSignal<ProductTypeFilterToBeChosen[]> = signal([]);
  get productTypesToBeFilteredOut$() {
    return this._productTypesToBeFilteredOut;
  }
  set productTypesToBeFilteredOut(lots: BakLot[]) {
    const presentTypes = this._productTypesToBeFilteredOut().reduce((acc, type) => {
      acc[type.id] = type;
      return acc;
    }, {} as any);
    this._productTypesToBeFilteredOut.set(
      Object.values(
        lots
          .map((lot) => lot.product.type)
          .reduce((acc, type) => {
            if (acc[type.id]) return acc;
            acc[type.id] = {
              ...type,
              checked: false,
            };
            return acc;
          }, presentTypes),
      ),
    );
  }
}
