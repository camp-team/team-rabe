import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserData } from 'src/app/interfaces/user-data';
import { AuthService } from 'src/app/services/auth.service';
import { RedirectService } from 'src/app/services/redirect.service';
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
  oldImageUrl: string;

  constructor(
    private fb: FormBuilder,
    private authServie: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getOldImageUrl();
  }

  private getOldImageUrl(): void {
    this.user$
      .pipe(take(1))
      .toPromise()
      .then((user: UserData) => (this.oldImageUrl = user.avatarURL));
  }

  changeUserName(): void {
    const newUserName: string = this.nameForm.value;
    this.userService.changeUserName(this.uid, newUserName).then(() => {
      this.nameForm.reset();
      this.snackBar.open('ユーザー名を変更しました！');
    });
  }

  changeUserAvatar(image: string): void {
    this.userService
      .changeUserAvatar(this.uid, image)
      .then(() => this.snackBar.open('アバター画像を変更しました！'));
  }
}
