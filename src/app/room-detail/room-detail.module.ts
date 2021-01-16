import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomDetailRoutingModule } from './room-detail-routing.module';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { UrlAndQrModule } from '../url-and-qr/url-and-qr.module';

@NgModule({
  declarations: [RoomDetailComponent],
  imports: [CommonModule, RoomDetailRoutingModule, UrlAndQrModule],
})
export class RoomDetailModule {}
