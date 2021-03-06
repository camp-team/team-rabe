import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoomDetailRoutingModule } from './room-detail-routing.module';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { SidenavRightComponent } from './sidenav-right/sidenav-right.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [RoomDetailComponent, SidenavRightComponent],
  imports: [
    CommonModule,
    RoomDetailRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatRippleModule,
    SwiperModule,
  ],
})
export class RoomDetailModule {}
