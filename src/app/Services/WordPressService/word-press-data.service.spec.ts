import { TestBed, inject } from '@angular/core/testing';

import { WordPressDataService } from './word-press-data.service';

describe('WordPressDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordPressDataService]
    });
  });

  it('should be created', inject([WordPressDataService], (service: WordPressDataService) => {
    expect(service).toBeTruthy();
  }));
});
