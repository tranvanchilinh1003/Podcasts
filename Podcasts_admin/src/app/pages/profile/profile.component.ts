import { Component } from '@angular/core';
import { LOCALSTORAGE_KEY } from 'app/@core/config/local-storage-key.config';
import { LocalStorageService } from 'app/@core/services/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  inforAdmin = this.storageService.getItem(LOCALSTORAGE_KEY.userInfo);
  constructor(
    private storageService: LocalStorageService
  ){

  }
}
