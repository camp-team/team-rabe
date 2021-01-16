import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-url-and-qr',
  templateUrl: './url-and-qr.component.html',
  styleUrls: ['./url-and-qr.component.scss'],
})
export class UrlAndQrComponent implements OnInit {
  url: string = window.location.href;

  roomURL: FormControl = this.fb.control('');

  constructor(private snackBar: MatSnackBar, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.roomURL.setValue(this.url);
  }

  copyToClipBoard(): void {
    this.snackBar.open('URLをコピーしました');
  }
}
