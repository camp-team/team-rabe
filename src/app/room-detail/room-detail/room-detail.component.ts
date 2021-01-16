import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
})
export class RoomDetailComponent implements OnInit {
  opened$: Observable<boolean> = this.uiService.isOpen$;
  scrWidth: any;

  constructor(private uiService: UiService) {}

  ngOnInit(): void {
    this.getScreenSize();
  }

  toggleNav(): void {
    this.uiService.toggleOpening();
    console.log('toggle');
  }

  getScreenSize(): void {
    this.scrWidth = window.innerWidth;
  }
}
