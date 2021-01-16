import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyPageRoutingModule } from './my-page-routing.module';
import { MyPageComponent } from './my-page/my-page.component';
import { RoomEditComponent } from './room-edit/room-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserEditComponent } from './user-edit/user-edit.component';

@NgModule({
  declarations: [MyPageComponent, RoomEditComponent, UserEditComponent],
  imports: [
    CommonModule,
    MyPageRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class MyPageModule {}
