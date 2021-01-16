import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/interfaces/user-data';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-sidenav-right',
  templateUrl: './sidenav-right.component.html',
  styleUrls: ['./sidenav-right.component.scss'],
})
export class SidenavRightComponent implements OnInit {
  opened$: Observable<boolean> = this.uiService.isOpen$;
  user$: Observable<UserData> = this.authService.user$;

  users = new Array(12);

  constructor(private uiService: UiService, private authService: AuthService) {}

  ngOnInit(): void {
    console.log(this.users);
  }

  toggleNav(): void {
    this.uiService.toggleOpening();
  }
}
