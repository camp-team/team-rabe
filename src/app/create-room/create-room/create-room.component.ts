import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {
  readonly userNameMaxLength = 60;
  readonly descreptionMaxLength = 500;

  form: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.maxLength(this.userNameMaxLength)],
    ],
    description: ['', [Validators.maxLength(this.descreptionMaxLength)]],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
