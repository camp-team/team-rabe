import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { RoomService } from 'src/app/services/room.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
})
export class RoomDetailComponent implements OnInit {
  opened$: Observable<boolean> = this.uiService.isOpen$;
  scrWidth: any;
  roomPage = true;
  entryLogs$;

  constructor(
    private uiService: UiService,
    private roomServie: RoomService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getScreenSize();
    this.getEntryLogs();
  }

  toggleNav(): void {
    this.uiService.toggleOpening();
    console.log('toggle');
  }

  getScreenSize(): void {
    this.scrWidth = window.innerWidth;
  }

  getEntryLogs() {
    this.route.paramMap.subscribe((param: ParamMap) => {
      const roomId: string = param.get('id');
      console.log(roomId);
      this.entryLogs$ = this.roomServie.getEntryLogs(roomId);
    });
  }
}
