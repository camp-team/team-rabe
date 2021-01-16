import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/interfaces/user-data';
import { UiService } from 'src/app/services/ui.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidenav-right',
  templateUrl: './sidenav-right.component.html',
  styleUrls: ['./sidenav-right.component.scss'],
})
export class SidenavRightComponent implements OnInit {
  opened$: Observable<boolean> = this.uiService.isOpen$;
  user$: Observable<UserData> = this.userService.user$;

  users = new Array(12);

  constructor(private uiService: UiService, private userService: UserService) {}

  ngOnInit(): void {
    console.log(this.users);
  }

  toggleNav(): void {
    this.uiService.toggleOpening();
  }
}
