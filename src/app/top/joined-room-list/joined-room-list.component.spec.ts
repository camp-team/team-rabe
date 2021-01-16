import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinedRoomListComponent } from './joined-room-list.component';

describe('JoinedRoomListComponent', () => {
  let component: JoinedRoomListComponent;
  let fixture: ComponentFixture<JoinedRoomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoinedRoomListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinedRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
