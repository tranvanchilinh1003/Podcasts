import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Router } from '@angular/router';

import { DialogService  } from '../../../@core/services/common/dialog.service'
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {LayoutService} from "../../../@core/services/common/layout.service";
import {AuthService} from "../../../@core/services/apis";
import {API_BASE_URL, API_ENDPOINT} from "../../../@core/config/api-endpoint.config";
import {LocalStorageService} from "../../../@core/services/common/local-storage.service";
import {LOCALSTORAGE_KEY, ROUTER_CONFIG} from "../../../@core/config";
@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Sáng',
    },
    {
      value: 'dark',
      name: 'Tối',
    },
  ];

  currentTheme = 'default';

  userMenu = [ { title: 'Thông tin',icon: 'person-outline', link:'/pages/profile' }, { title: 'Đăng xuất', icon: 'power' } ];


  constructor(
    private storageService: LocalStorageService,
    readonly authService: AuthService,
    private router: Router,
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private dialog: DialogService
  ) { 


  }

  ngOnInit() {
  const inforAdmin = this.storageService.getItem(LOCALSTORAGE_KEY.userInfo);

  
    this.currentTheme = this.themeService.currentTheme;
    this.user = {name: `${inforAdmin[0].username}`, picture: `https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${inforAdmin[0].images}?alt=media&token=b57f368c-2d95-44ad-ad36-ec176793046d`}
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
        .pipe(
            map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
            takeUntil(this.destroy$),
        )
        .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
        .pipe(
            map(({ name }) => name),
            takeUntil(this.destroy$),
        )
        .subscribe(themeName => this.currentTheme = themeName);
        this.menuService.onItemClick()
        .pipe(takeUntil(this.destroy$))
        .subscribe((event) => {
          if (event.item.title === 'Đăng xuất') {
                    
          this.onLogout();
          }
        });
        
  }
  onLogout(){
    this.authService.logout().subscribe(
      ()=> {
        this.dialog.success('Đăng xuất thành công')
      },
        err =>{
          console.log(err);
          
        }
    )
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  navigateHome() {
    this.router.navigateByUrl('/pages');
    return false;
  }
}
