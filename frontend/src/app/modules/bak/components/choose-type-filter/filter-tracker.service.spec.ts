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
    service.productsTypesToShow = [
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
    expect(service.productsTypesToShow$()).toEqual([
      {
        id: '1',
        name: 'type 1',
        checked: true,
      },
      {
        id: '2',
        name: 'type 2',
        checked: true,
      },
    ]);

    service.productsTypesToShow = [
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

    expect(service.productsTypesToShow$()).toEqual([
      {
        id: '1',
        name: 'type 1',
        checked: true,
      },
      {
        id: '2',
        name: 'type 2',
        checked: true,
      },
      {
        id: '3',
        name: 'type 3',
        checked: true,
      },
    ]);
  });

  it('should toggle filter', () => {
    service.productsTypesToShow = [
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
      checked: false,
    };
    service.toggleFilter(filter);
    expect(service.productsTypesToShow$()).toEqual([filter]);
  });

  it('should toggle filter twice', () => {
    service.productsTypesToShow = [
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
      checked: false,
    };
    service.toggleFilter(filter);
    expect(service.productsTypesToShow$()).toEqual([filter]);

    filter.checked = true;
    service.toggleFilter(filter);
    expect(service.productsTypesToShow$()).toEqual([filter]);
  });
});
