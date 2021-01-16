import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlAndQrComponent } from './url-and-qr.component';

describe('UrlAndQrComponent', () => {
  let component: UrlAndQrComponent;
  let fixture: ComponentFixture<UrlAndQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UrlAndQrComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlAndQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
