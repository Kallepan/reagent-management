import { DestroyRef, Injectable, inject } from '@angular/core';
import { TypeAPIService } from './type-api.service';
import { LocationAPIService } from './location-api.service';
import { LotAPIService } from './lot-api.service';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { BakLocation } from '../interfaces/location';
import { BakType } from '../interfaces/type';
import { ReagentAPIService } from './reagent-api.service';
import { BakLot, CreateBakLot } from '../interfaces/lot';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NotificationService } from '@app/core/services/notification.service';
import { messages } from '@app/core/constants/messages';

@Injectable({
  providedIn: 'any'
})
export class BakStateHandlerService {
  private destroyRef = inject(DestroyRef)
  private typeAPIService = inject(TypeAPIService);
  private lotAPIService = inject(LotAPIService);
  private locationAPIService = inject(LocationAPIService);
  private reagentAPIService = inject(ReagentAPIService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  locations = new BehaviorSubject<BakLocation[]>([]);
  types = new BehaviorSubject<BakType[]>([]);

  lots = new BehaviorSubject<BakLot[]>([]);

  private _finishedLoading = false;

  constructor() {
    // populate locations and types
    this.refreshData();
  }

  refreshData() {
    this.locationAPIService.getLocations().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((locations) => {
      this.locations.next(locations);
    });
    this.typeAPIService.getTypes().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((types) => {
      this.types.next(types);
    });

    // populate lots
    this.lotAPIService.getLots().pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => this._finishedLoading = true),
    ).subscribe((lots) => {
      this.lots.next(lots);
    });
  }

  // search for a lot
  searchLots(searchString: string) {
    const params = {
      name: searchString,
    };

    return this.lotAPIService.searchLots(params);
  }

  // Patch the amount of a reagent.
  patchReagent(reagentId: string, amount: number) {
    this.reagentAPIService.patchReagent(reagentId, amount).subscribe({
      next: (resp) => {
        // update lots
        this.lots.getValue().find(lot => lot.id === resp.lot.id)!.reagents.find(reagent => reagent.id === resp.id)!.amount = resp.amount;
      }
    });
  }

  // Check if a lot exists.
  lotExists(lotId: string): boolean {
    return this.lots.getValue().some(lot => lot.id === lotId);
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
    });
  }

  // Patch a lot.
  patchLot(lotId: string, data: any) {
    this.lotAPIService.patchLot(lotId, data).subscribe({
      next: (resp) => {
        const lots = this.lots.getValue();
        const lotIndex = lots.findIndex(lot => lot.id === resp.id);
        lots[lotIndex] = resp;

        // update lots
        this.lots.next(lots);
      },
      complete: () => {
        this.router.navigate(['bak', 'lots']);
      }
    });
  }

  get finishedLoading() {
    return this._finishedLoading;
  }

  public handleReagentTransfer(result: { sourceReagent: string, targetReagent: string, sourceAmount: number, targetAmount: number }) {
    this.reagentAPIService.patchReagent(result.sourceReagent, result.sourceAmount).pipe(
      tap((data) => {
        this.lots.getValue().find(lot => lot.id === data.lot.id)!.reagents.find(reagent => reagent.id === data.id)!.amount = data.amount;
      }),
      switchMap(() => this.reagentAPIService.patchReagent(result.targetReagent, result.targetAmount)),
      tap((data) => {
        this.lots.getValue().find(lot => lot.id === data.lot.id)!.reagents.find(reagent => reagent.id === data.id)!.amount = data.amount;
      }),
    ).subscribe({
      next: () => {
        this.router.navigate(['bak', 'lots']);
        this.notificationService.infoMessage(messages.BAK.REAGENT_TRANSFER_SUCCESS);
      },
      error: (err) => {
        this.notificationService.warnMessage(messages.GENERAL.UPDATE_FAILED);
      }
    })
  }
}
