import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Router } from '@angular/router';


import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {LayoutService} from "../../../@core/services/common/layout.service";

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

  userMenu = [ { title: 'Profile',icon: 'person-outline' }, { title: 'Log out', icon: 'power' } ];

  constructor(
    private router: Router,
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService
  ) { }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.user = {name: 'Alibaba', picture: 'assets/images/account.png'}
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
