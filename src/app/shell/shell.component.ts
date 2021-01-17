import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UiService } from '../services/ui.service';
import { UrlAndQrComponent } from '../url-and-qr/url-and-qr/url-and-qr.component';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  @ViewChild('element')
  private element: HTMLElement;

  roomPage: boolean;
  isLargeScreen: boolean;

  constructor(private dialog: MatDialog, private uiService: UiService) {}

  ngOnInit(): void {
    this.isLargeScreen = this.uiService.isLargeScreen(this.element);
  }

  onActivate(event: any): void {
    this.roomPage = event.roomPage;
  }

  openDialog(): void {
    this.dialog.open(UrlAndQrComponent, {
      width: '1024',
      height: '768',
      autoFocus: false,
    });
  }
}
