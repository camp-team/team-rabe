import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  isOpenSource = new ReplaySubject<boolean>(1);
  isOpen$: Observable<boolean> = this.isOpenSource.asObservable();
  isOpened: boolean;

  constructor() {}

  toggleOpening(): void {
    this.isOpened = !this.isOpened;
    this.isOpenSource.next(this.isOpened);
  }

  isLargeScreen(container: HTMLElement): boolean {
    const screenWidth = window.innerWidth || container.clientWidth;
    const mobileScreen = 700;
    if (screenWidth >= mobileScreen) {
      return true;
    } else {
      return false;
    }
  }
}
