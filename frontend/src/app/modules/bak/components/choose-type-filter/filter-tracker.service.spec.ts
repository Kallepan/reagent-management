import { TestBed } from '@angular/core/testing';

import { FilterTrackerService } from './filter-tracker.service';

describe('FilterTrackerService', () => {
  let service: FilterTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterTrackerService],
    });
    service = TestBed.inject(FilterTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should populate filters', () => {
    service.productTypesToBeFilteredOut = [
      {
        id: '1',
        name: 'type 1',
        product: {
          id: '1',
          name: 'product',
          type: {
            id: '1',
            name: 'type 1',
          },
        },
      } as any,
      {
        id: '2',
        name: 'type 2',
        product: {
          id: '2',
          name: 'product',
          type: {
            id: '2',
            name: 'type 2',
          },
        },
      } as any,
    ];
    expect(service.productTypesToBeFilteredOut$()).toEqual([
      {
        id: '1',
        name: 'type 1',
        checked: false,
      },
      {
        id: '2',
        name: 'type 2',
        checked: false,
      },
    ]);

    service.productTypesToBeFilteredOut = [
      {
        id: '1',
        name: 'type 1',
        product: {
          id: '1',
          name: 'product',
          type: {
            id: '3',
            name: 'type 3',
          },
        },
      } as any,
    ];

    expect(service.productTypesToBeFilteredOut$()).toEqual([
      {
        id: '1',
        name: 'type 1',
        checked: false,
      },
      {
        id: '2',
        name: 'type 2',
        checked: false,
      },
      {
        id: '3',
        name: 'type 3',
        checked: false,
      },
    ]);
  });

  it('should toggle filter', () => {
    service.productTypesToBeFilteredOut = [
      {
        id: '1',
        name: 'filter',
        product: {
          id: '1',
          name: 'product',
          type: {
            id: '1',
            name: 'type 1',
          },
        },
      } as any,
    ];
    const filter = {
      id: '1',
      name: 'type 1',
      checked: true,
    };
    service.toggleFilter(filter);
    expect(service.productTypesToBeFilteredOut$()).toEqual([filter]);
  });

  it('should toggle filter twice', () => {
    service.productTypesToBeFilteredOut = [
      {
        id: '1',
        name: 'filter',
        product: {
          id: '1',
          name: 'product',
          type: {
            id: '1',
            name: 'type 1',
          },
        },
      } as any,
    ];
    const filter = {
      id: '1',
      name: 'type 1',
      checked: true,
    };
    service.toggleFilter(filter);
    expect(service.productTypesToBeFilteredOut$()).toEqual([filter]);

    filter.checked = false;
    service.toggleFilter(filter);
    expect(service.productTypesToBeFilteredOut$()).toEqual([filter]);
  });
});
