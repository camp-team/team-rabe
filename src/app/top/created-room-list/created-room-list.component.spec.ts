import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedRoomListComponent } from './created-room-list.component';

describe('CreatedRoomListComponent', () => {
  let component: CreatedRoomListComponent;
  let fixture: ComponentFixture<CreatedRoomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatedRoomListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
