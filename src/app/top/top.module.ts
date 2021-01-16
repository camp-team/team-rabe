import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopRoutingModule } from './top-routing.module';
import { TopComponent } from './top/top.component';
import { CreatedRoomListComponent } from './created-room-list/created-room-list.component';
import { JoinedRoomListComponent } from './joined-room-list/joined-room-list.component';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { JoinRoomDialogComponent } from './join-room-dialog/join-room-dialog.component';

@NgModule({
  declarations: [
    TopComponent,
    CreatedRoomListComponent,
    JoinedRoomListComponent,
    CreateDialogComponent,
    JoinRoomDialogComponent,
  ],
  imports: [CommonModule, TopRoutingModule],
})
export class TopModule {}
