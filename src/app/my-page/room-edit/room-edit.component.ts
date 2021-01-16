import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CropperOptions } from '@deer-inc/ngx-croppie';
import { Room } from 'src/app/interfaces/room';
import { RoomService } from 'src/app/services/room.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RedirectService } from 'src/app/services/redirect.service';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss'],
})
export class RoomEditComponent implements OnInit {
  private readonly roomId: string = this.route.snapshot.paramMap.get('id');

  readonly userNameMaxLength = 60;
  readonly descriptionMaxLength = 500;
  // readonly passwordMinLength = 6;

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
    description: [
      '',
      [Validators.required, Validators.maxLength(this.descriptionMaxLength)],
    ],
    // password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]],
  });

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private redirectService: RedirectService
  ) {}

  ngOnInit(): void {
    this.roomService.getRoom(this.roomId).subscribe((room) => {
      this.form.patchValue(room);
      this.imageFile = room.iconURL;
    });

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
      const roomValue: Omit<Room, 'createdAt' | 'entrylogs'> = {
        roomId: this.roomId,
        name: formData.name,
        description: formData.description,
        iconURL: this.imageFile,
        updatedAt: new Date(),
        ownerId: this.authService.uid,
        joinedUserIds: this.joinedUserIds,
      };

      await this.roomService
        .updateRoom(roomValue)
        .then(() => {
          this.snackBar.open('ルームを編集しました！');
          this.redirectService.redirectToRoomDetail(this.roomId);
        })
        .finally(() => (this.isProcessing = false));
    }
  }
}
