import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UrlAndQrComponent } from '../url-and-qr/url-and-qr/url-and-qr.component';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  roomPage: boolean;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

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
