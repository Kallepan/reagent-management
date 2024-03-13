import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { constants } from '@app/core/constants/constants';
import { Product } from '../interfaces/type';
import { ProductAPIService } from './product-api.service';

describe('ProductAPIService', () => {
  let service: ProductAPIService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductAPIService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductAPIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Dummy Product',
        article_number: '123456789',
        created_at: new Date(),
        type: {
          id: '10',
          name: 'Dummy Type',
          created_at: new Date(),
        },
        producer: {
          id: '11',
          name: 'Dummy Producer',
          created_at: new Date(),
        },
      },
      {
        id: '2',
        name: 'Dummy Product 2',
        article_number: '987654321',
        created_at: new Date(),
        type: {
          id: '10',
          name: 'Dummy Type',
          created_at: new Date(),
        },
        producer: {
          id: '11',
          name: 'Dummy Producer',
          created_at: new Date(),
        },
      },
    ];

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const request = httpMock.expectOne(constants.APIS.BAK.BASE + '/products' + '?limit=500');
    expect(request.request.method).toBe('GET');
    request.flush({ data: {results:  mockProducts }});
  });

  it('should get a product by id', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Dummy Product',
      article_number: '123456789',
      created_at: new Date(),
      type: {
        id: '10',
        name: 'Dummy Type',
        created_at: new Date(),
      },
      producer: {
        id: '11',
        name: 'Dummy Producer',
        created_at: new Date(),
      },
    };

    service.getProductById('1').subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const request = httpMock.expectOne(constants.APIS.BAK.BASE + '/products/1');
    expect(request.request.method).toBe('GET');
    request.flush({ data: mockProduct });
  });
});
