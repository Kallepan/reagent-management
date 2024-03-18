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
    const newFilters = this._productsTypesToShow().map((f) => {
      if (f.id === filter.id) {
        f.checked = !f.checked;
      }
      return f;
    });
    this._productsTypesToShow.set(newFilters);
  }

  private _productsTypesToShow: WritableSignal<ProductTypeFilterToBeChosen[]> = signal([]);
  get productsTypesToShow$() {
    return this._productsTypesToShow;
  }
  set productsTypesToShow(lots: BakLot[]) {
    const presentTypes = this._productsTypesToShow().reduce((acc, type) => {
      acc[type.id] = type;
      return acc;
    }, {} as any);
    this._productsTypesToShow.set(
      Object.values(
        lots
          .map((lot) => lot.product.type)
          .reduce((acc, type) => {
            if (acc[type.id]) return acc;
            acc[type.id] = {
              ...type,
              checked: true,
            };
            return acc;
          }, presentTypes),
      ),
    );
  }
}
