import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from 'src/app/interfaces/room';
import { AuthService } from 'src/app/services/auth.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-created-room-list',
  templateUrl: './created-room-list.component.html',
  styleUrls: ['./created-room-list.component.scss'],
})
export class CreatedRoomListComponent implements OnInit {
  private uid: string = this.authService.uid;

  createdRooms$: Observable<Room[]>;

  constructor(
    private roomService: RoomService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCreatedRooms();
  }

  private getCreatedRooms(): void {
    this.createdRooms$ = this.roomService.getCreatedRooms(this.uid);
  }
}
