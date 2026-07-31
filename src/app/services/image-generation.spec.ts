import { TestBed } from '@angular/core/testing';

import { ImageGeneration } from './image-generation';

describe('ImageGeneration', () => {
  let service: ImageGeneration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageGeneration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
