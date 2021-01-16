import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateRoomRoutingModule } from './create-room-routing.module';
import { CreateRoomComponent } from './create-room/create-room.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [CreateRoomComponent],
  imports: [
    CommonModule,
    CreateRoomRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
})
export class CreateRoomModule {}
