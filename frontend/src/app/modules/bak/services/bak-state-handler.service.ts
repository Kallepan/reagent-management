import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { messages } from '@app/core/constants/messages';
import { NotificationService } from '@app/core/services/notification.service';
import { BehaviorSubject, filter, switchMap, tap } from 'rxjs';
import { BakLocation } from '../interfaces/location';
import { BakLot, CreateBakLot } from '../interfaces/lot';
import { Product } from '../interfaces/type';
import { LocationAPIService } from './location-api.service';
import { LotAPIService } from './lot-api.service';
import { ProductAPIService } from './product-api.service';
import { ReagentAPIService } from './reagent-api.service';

@Injectable({
  providedIn: null,
})
export class BakStateHandlerService {
  private destroyRef = inject(DestroyRef);
  private productAPIService = inject(ProductAPIService);
  private lotAPIService = inject(LotAPIService);
  private locationAPIService = inject(LocationAPIService);
  private reagentAPIService = inject(ReagentAPIService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  locations = new BehaviorSubject<BakLocation[]>([]);
  products = new BehaviorSubject<Product[]>([]);

  lots = new BehaviorSubject<BakLot[]>([]);
  activeLot = new BehaviorSubject<BakLot | null>(null);

  private _finishedLoading = false;

  constructor() {
    // populate locations and types
    this.refreshData();
  }

  refreshData() {
    this.locationAPIService
      .getLocations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((locations) => {
        this.locations.next(locations);
      });
    this.productAPIService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.products.next(data);
      });

    // populate lots
    this.lotAPIService
      .getLots()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => (this._finishedLoading = true)),
      )
      .subscribe((lots) => {
        this.lots.next(lots);
      });
  }

  // search for a lot
  searchLots(searchString: string, fetchEmpty: boolean = true) {
    const params = {
      search: searchString,
      is_empty: 'true',
    };
    if (!fetchEmpty) {
      params.is_empty = 'false';
    }
    return this.lotAPIService.searchLots(params);
  }

  // Patch the amount of a reagent.
  patchReagentInList(reagentId: string, amount: number) {
    this.reagentAPIService.patchReagent(reagentId, amount).subscribe({
      next: (resp) => {
        // update lots
        const lots = this.lots.getValue();
        const lotIndex = lots.findIndex((lot) => lot.id === resp.lot.id);

        if (lotIndex === -1) return;

        const reagentIndex = lots[lotIndex].reagents.findIndex((reagent) => reagent.id === resp.id);
        if (reagentIndex === -1) return;

        lots[lotIndex].reagents[reagentIndex].amount = resp.amount;
        this.lots.next(lots);
      },
    });
  }

  patchReagentSingle(reagentId: string, amount: number) {
    this.reagentAPIService
      .patchReagent(reagentId, amount)
      .pipe(filter(() => this.activeLot.value !== null))
      .subscribe({
        next: (resp) => {
          // update lots
          const lot = this.activeLot.value!;

          const reagentIndex = lot.reagents.findIndex((reagent) => reagent.id === resp.id);
          if (reagentIndex === -1) return;

          lot.reagents[reagentIndex].amount = resp.amount;
          this.activeLot.next(lot);
        },
      });
  }

  // Check if a lot exists.
  lotExists(lotId: string): boolean {
    return this.lots.getValue().some((lot) => lot.id === lotId);
  }

  // Create a new lot.
  createLot(lot: CreateBakLot) {
    this.lotAPIService.postLot(lot).subscribe({
      next: (resp) => {
        const lots = this.lots.getValue();
        lots.push(resp);

        // update lots
        this.lots.next(lots);

        // navigate to the new lot
        this.router.navigate(['bak', 'lots', 'detail', resp.id]);
      },
      complete: () => {
        // notify user
        this.notificationService.infoMessage(messages.BAK.LOT_CREATE_SUCCESS);
      },
    });
  }

  // Delete a lot.
  deleteLot(lotId: string) {
    this.lotAPIService.deleteLot(lotId).subscribe({
      next: () => {
        // remove lot from lots
        const lots = this.lots.getValue();
        const lotIndex = lots.findIndex((lot) => lot.id === lotId);
        lots.splice(lotIndex, 1);

        // update lots
        this.lots.next(lots);

        // navigate to lots page
        this.router.navigate(['bak', 'lots']);
      },
    });
  }

  // Patch a lot.
  patchLot(lotId: string, data: any) {
    this.lotAPIService.patchLot(lotId, data).subscribe({
      next: (resp) => {
        const lots = this.lots.getValue();
        const lotIndex = lots.findIndex((lot) => lot.id === resp.id);
        lots[lotIndex] = resp;

        // update lots
        this.lots.next(lots);
      },
      complete: () => {
        this.notificationService.infoMessage(messages.BAK.LOT_UPDATE_SUCCESS);

        // navigate to lots page
        this.router.navigate(['bak']);
      },
    });
  }

  get finishedLoading() {
    return this._finishedLoading;
  }

  public handleReagentTransfer(result: {
    sourceReagent: string;
    targetReagent: string;
    sourceAmount: number;
    targetAmount: number;
  }) {
    this.reagentAPIService
      .patchReagent(result.sourceReagent, result.sourceAmount)
      .pipe(
        tap((data) => {
          this.lots
            .getValue()
            .find((lot) => lot.id === data.lot.id)!
            .reagents.find((reagent) => reagent.id === data.id)!.amount = data.amount;
        }),
        switchMap(() =>
          this.reagentAPIService.patchReagent(result.targetReagent, result.targetAmount),
        ),
        tap((data) => {
          this.lots
            .getValue()
            .find((lot) => lot.id === data.lot.id)!
            .reagents.find((reagent) => reagent.id === data.id)!.amount = data.amount;
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['bak', 'lots']);
          this.notificationService.infoMessage(messages.BAK.REAGENT_TRANSFER_SUCCESS);
        },
        error: (err) => {
          this.notificationService.warnMessage(messages.GENERAL.UPDATE_FAILED);
        },
      });
  }
}
