import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Router } from '@angular/router';


import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {LayoutService} from "../../../@core/services/common/layout.service";
import {AuthService} from "../../../@core/services/apis";
import {API_BASE_URL, API_ENDPOINT} from "../../../@core/config/api-endpoint.config";
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

  userMenu = [ { title: 'Profile',icon: 'person-outline' }, { title: 'Log out', icon: 'power', link: API_BASE_URL + API_ENDPOINT.auth.logout  } ];


  constructor(
    readonly authService: AuthService,
    private router: Router,
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService
  ) { }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.user = {name: 'Admin', picture: 'https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F2024-05-28T15%3A00%3A32.409Z.jpg?alt=media&token=090f9aec-7cfd-4617-a718-de0681ef344c'}
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
