import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CropperOptions } from '@deer-inc/ngx-croppie';
import { Room } from 'src/app/interfaces/room';
import { AuthService } from 'src/app/services/auth.service';
import { RedirectService } from 'src/app/services/redirect.service';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {
  readonly userNameMaxLength = 60;
  readonly descriptionMaxLength = 500;

  private uid: string = this.authService.uid;

  isProcessing: boolean;
  oldImageUrl = '';
  joinedUserIds: string[];
  imageFile: string;
  options: CropperOptions;

  form: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.maxLength(this.userNameMaxLength)],
    ],
    description: ['', [Validators.maxLength(this.descriptionMaxLength)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private roomService: RoomService,
    private redirectService: RedirectService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.options = {
      aspectRatio: 1 / 1,
      oldImageUrl: this.imageFile,
      width: 420,
      resultType: 'base64',
    };
  }

  onCroppedImage(image: string): void {
    this.imageFile = image;
  }

  async submit(): Promise<void> {
    this.isProcessing = true;
    const formData = this.form.value;

    if (this.imageFile !== undefined) {
      const roomValue: Omit<Room, 'createdAt' | 'entrylogs' | 'roomId'> = {
        name: formData.name,
        description: formData.description,
        iconURL: this.imageFile,
        updatedAt: new Date(),
        ownerId: this.authService.uid,
      };

      await this.roomService
        .createRoom(roomValue)
        .then((id) => {
          this.snackBar.open('ルームを作成しました！');
          this.redirectService.redirectToRoomDetail(id);
          this.userService.addUserCreatedRoomId(this.uid, id);
        })
        .finally(() => (this.isProcessing = false));
    }
  }
}
