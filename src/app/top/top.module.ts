import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopRoutingModule } from './top-routing.module';
import { TopComponent } from './top/top.component';
import { CreatedRoomListComponent } from './created-room-list/created-room-list.component';
import { JoinedRoomListComponent } from './joined-room-list/joined-room-list.component';
import { JoinRoomDialogComponent } from './join-room-dialog/join-room-dialog.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    TopComponent,
    CreatedRoomListComponent,
    JoinedRoomListComponent,
    JoinRoomDialogComponent,
  ],
  imports: [CommonModule, TopRoutingModule, MatDividerModule, MatIconModule],
})
export class TopModule {}
