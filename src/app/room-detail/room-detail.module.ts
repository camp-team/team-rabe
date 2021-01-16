import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomDetailRoutingModule } from './room-detail-routing.module';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { SidenavRightComponent } from './sidenav-right/sidenav-right.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [RoomDetailComponent, SidenavRightComponent],
  imports: [
    CommonModule,
    RoomDetailRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
})
export class RoomDetailModule {}
