import { TestBed } from '@angular/core/testing';

import { TypeAPIService } from './type-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  BakType
} from '../interfaces/type';
import { constants } from '@app/core/constants/constants';
describe('TypeAPIService', () => {
  let service: TypeAPIService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TypeAPIService],
    });
    service = TestBed.inject(TypeAPIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all types', () => {
    const mockTypes: BakType[] = [
      { id: '1', name: 'test1', producer: 'test_producer_1', created_at: '2021-01-01T00:00:00.000Z', article_number: 'test_article_number_1' },
      { id: '2', name: 'test2', producer: 'test_producer_2', created_at: '2021-01-01T00:00:00.000Z', article_number: 'test_article_number_2' },
      { id: '3', name: 'test3', producer: 'test_producer_3', created_at: '2021-01-01T00:00:00.000Z' },
    ];

    service.getTypes().subscribe(types => {
      expect(types.length).toBe(3);
      expect(types).toEqual(mockTypes);
    });

    const req = httpMock.expectOne(constants.APIS.BAK.BASE + '/types');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockTypes });
  });

  it('should get a type by id', () => {
    const mockType = { id: "1", name: 'Type 1', producer: 'test_producer_1', created_at: '2021-01-01T00:00:00.000Z' };

    service.getTypeById("1").subscribe(type => {
      expect(type).toEqual(mockType);
    });

    const req = httpMock.expectOne(constants.APIS.BAK.BASE + '/types/1');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockType });
  });
});
