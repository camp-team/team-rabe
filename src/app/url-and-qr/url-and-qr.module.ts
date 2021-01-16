import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlAndQrComponent } from './url-and-qr/url-and-qr.component';
import { QrCodeModule } from 'ng-qrcode';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [UrlAndQrComponent],
  imports: [
    CommonModule,
    QrCodeModule,
    MatSnackBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    ClipboardModule,
  ],
  exports: [UrlAndQrComponent],
})
export class UrlAndQrModule {}
