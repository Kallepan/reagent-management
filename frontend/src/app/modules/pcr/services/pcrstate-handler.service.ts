import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  switchMap,
  throwError,
} from 'rxjs';
import {
  Batch,
  CreateBatch,
  CreateReagent,
  Reagent,
} from '../interfaces/reagent';
import { CreateRemoval, Removal } from '../interfaces/removal';
import { Analysis, Device, Kind } from '../interfaces/simple';
import { AnalysisService } from './analysis.service';
import { BatchAPIService } from './batch-api.service';
import { DeviceService } from './device.service';
import { KindService } from './kind.service';
import { RemovalService } from './removal.service';

@Injectable({
  providedIn: null,
})
export class PCRStateHandlerService {
  // some minor states
  private lastSearchTerm: string | null = null;

  // system-wide loading state
  private destroyRef = inject(DestroyRef);

  // Module specific loading state
  private kindAPIService = inject(KindService);
  private deviceAPIService = inject(DeviceService);
  private analysisAPIService = inject(AnalysisService);
  private removalAPIService = inject(RemovalService);
  private batchAPIService = inject(BatchAPIService);

  // Module specific data
  kinds = new BehaviorSubject<Kind[]>([]);
  devices = new BehaviorSubject<Device[]>([]);
  analyses = new BehaviorSubject<Analysis[]>([]);
  reagents = new BehaviorSubject<Reagent[]>([]);

  // initial loading
  constructor() {
    this.refreshData();
  }
  private refreshData() {
    this.kindAPIService
      .getKinds()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((kinds) => {
        this.kinds.next(kinds);
      });
    this.deviceAPIService
      .getDevices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((devices) => {
        this.devices.next(devices);
      });
    this.analysisAPIService
      .getAnalyses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((analyses) => {
        this.analyses.next(analyses);
      });
  }

  createOnlyReagents(reagents: CreateReagent[]): Observable<any> {
    return this.batchAPIService.createReagents(reagents);
  }

  // reagents
  createReagents(
    groupData: any,
    reagentIDs: { id: string }[],
  ): Observable<any> {
    const newBatch: CreateBatch = {
      kind_id: groupData.kind.id,
      device_id: groupData.device.id,
      analysis_id: groupData.analysis.id,
      comment: groupData.comment,
      created_by: groupData.created_by,
    };

    // Create the batch -> Post the reagents with the created batch and finally return the batch id for navigation
    return this.batchAPIService.createBatch(newBatch).pipe(
      switchMap((batch) => {
        const batchId = batch.id;
        const reagentsWithBatchID = reagentIDs.map((reagent: any) => {
          const newReagent: CreateReagent = {
            batch_id: batchId,
            id: reagent.id,
            initial_amount: groupData.amount,
            created_by: groupData.created_by,
          };

          return newReagent;
        });

        return this.batchAPIService.createReagents(reagentsWithBatchID).pipe(
          catchError((err) => throwError(() => err)),
          map(() => batchId), // I only care about the id
        );
      }),
    );
  }

  // batch
  searchBatch(searchTerm: string): Observable<Batch[]> {
    const params = {
      search: searchTerm,
      reagents__is_empty: false, // TODO, maybe this is not needed
    };

    return this.batchAPIService.searchBatch(params);
  }
  getBatch(batchId: string): Observable<Batch> {
    return this.batchAPIService.getBatch(batchId);
  }
  deleteBatch(batchId: string): Observable<any> {
    return this.batchAPIService.deleteBatch(batchId);
  }
  updateBatchComment(batchId: string, comment: string): Observable<any> {
    return this.batchAPIService.updateBatchComment(batchId, comment);
  }

  // removal
  postRemoval(
    reagentID: string,
    createdBy: string,
    amount: number,
    comment: string,
  ): Observable<any> {
    const removal: CreateRemoval = {
      reagent_id: reagentID,
      created_by: createdBy,
      amount: amount,
      comment: comment,
    };
    return this.removalAPIService.postRemoval(removal);
  }
  deleteRemoval(removalId: string): Observable<any> {
    return this.removalAPIService.deleteRemoval(removalId);
  }
  updateRemoval(removal: Removal): Observable<any> {
    return this.removalAPIService.updateRemoval(removal);
  }

  // minor states
  setLastSearchTerm(searchTerm: string | null) {
    this.lastSearchTerm = searchTerm;
  }
  getLastSearchTerm() {
    return this.lastSearchTerm;
  }

  // amounts
  getDefaultAmountForBatch(
    analysisID: string,
    kindID: string,
  ): Observable<number> {
    return this.batchAPIService.getDefaultAmountForBatch(analysisID, kindID);
  }

  // max recommended removals
  getMaxRecommendedRemovalsForReagent(
    analysisID: string,
    kindID: string,
  ): Observable<number> {
    return this.batchAPIService.getMaxRecommendedRemovalsForReagent(
      analysisID,
      kindID,
    );
  }
}
