import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoomDetailRoutingModule } from './room-detail-routing.module';
import { RoomDetailComponent } from './room-detail/room-detail.component';

@NgModule({
  declarations: [RoomDetailComponent],
  imports: [CommonModule, RoomDetailRoutingModule],
})
export class RoomDetailModule {}
