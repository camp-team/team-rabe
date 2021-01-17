import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from 'src/app/interfaces/room';
import { AuthService } from 'src/app/services/auth.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-joined-room-list',
  templateUrl: './joined-room-list.component.html',
  styleUrls: ['./joined-room-list.component.scss'],
})
export class JoinedRoomListComponent implements OnInit {
  private uid: string = this.authService.uid;

  joinedRooms$: Observable<Room[]>;

  constructor(
    private roomService: RoomService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getJoinedRooms();
  }

  getJoinedRooms(): void {
    this.joinedRooms$ = this.roomService.getJoinedRooms(this.uid);
  }
}
