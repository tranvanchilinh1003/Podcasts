import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "../../../@core/services/common/local-storage.service";
import {LOCALSTORAGE_KEY, ROUTER_CONFIG} from "../../../@core/config";
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  inforAdmin = this.storageService.getItem(LOCALSTORAGE_KEY.userInfo);
  constructor(
    private storageService: LocalStorageService
  ){

  }
  OnInit(){
    
  }
  
}
