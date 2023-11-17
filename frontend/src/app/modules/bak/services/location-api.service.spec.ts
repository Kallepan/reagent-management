import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LocationAPIService } from './location-api.service';
import { BakLocation } from '../interfaces/location';
import { constants } from '@app/core/constants/constants';

describe('LocationAPIService', () => {
  let service: LocationAPIService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationAPIService],
    });
    service = TestBed.inject(LocationAPIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all locations ', () => {
    const mockLocations: BakLocation[] = [
      { id: '1', name: 'test1', created_at: '2021-01-01T00:00:00.000Z' },
      { id: '2', name: 'test2', created_at: '2021-01-01T00:00:00.000Z' },
      { id: '3', name: 'test3', created_at: '2021-01-01T00:00:00.000Z' },
    ];

    service.getLocations().subscribe((locations) => {
      expect(locations.length).toBe(3);
      expect(locations).toEqual(mockLocations);
    });

    const req = httpMock.expectOne(constants.APIS.BAK.BASE + '/locations');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockLocations });
  });

  it('should get a location by id', () => {
    const mockLocation = { id: "1", name: 'Location 1', created_at: '2021-01-01T00:00:00.000Z' };

    service.getLocationById("1").subscribe(location => {
      expect(location).toEqual(mockLocation);
    });

    const req = httpMock.expectOne(constants.APIS.BAK.BASE + '/locations/1');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockLocation });
  });
});
