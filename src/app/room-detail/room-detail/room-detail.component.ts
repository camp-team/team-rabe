import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserData } from 'src/app/interfaces/user-data';
import { RoomService } from 'src/app/services/room.service';
import { UiService } from 'src/app/services/ui.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
})
export class RoomDetailComponent implements OnInit {
  opened$: Observable<boolean> = this.uiService.isOpen$;
  scrWidth: any;
  roomPage = true;
  roomId: string;
  users$: Observable<UserData[]>;

  constructor(
    private uiService: UiService,
    private roomService: RoomService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getScreenSize();

    this.route.paramMap.subscribe((room) => {
      this.roomId = room.get('id');
      this.users$ = this.roomService.getJoinedRoomUsers(this.roomId).pipe(
        switchMap((userIds: { userId: string }[]) => {
          const user$$: Observable<UserData>[] = userIds.map(
            (doc: { userId: string }) => this.userService.getUser(doc.userId)
          );
          return combineLatest(user$$);
        })
      );
    });
  }

  toggleNav(): void {
    this.uiService.toggleOpening();
    console.log('toggle');
  }

  getScreenSize(): void {
    this.scrWidth = window.innerWidth;
  }
}
