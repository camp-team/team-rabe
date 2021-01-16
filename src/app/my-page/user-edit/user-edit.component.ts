import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/interfaces/user-data';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  private uid: string = this.authServie.uid;

  nameForm: FormControl = this.fb.control('', [
    Validators.required,
    Validators.maxLength(60),
  ]);
  user$: Observable<UserData> = this.authServie.user$;

  constructor(
    private fb: FormBuilder,
    private authServie: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  changeUserName(): void {
    const newUserName: string = this.nameForm.value;
    this.userService.changeUserName(this.uid, newUserName);
  }
}
