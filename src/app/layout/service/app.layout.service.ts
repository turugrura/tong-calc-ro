import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppConfig {
  inputStyle: string;
  colorScheme: string;
  theme: string;
  ripple: boolean;
  menuMode: string;
  scale: number;
  hideBasicAtk: boolean;
}

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
  myProfileVisible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  config: AppConfig = {
    ripple: localStorage.getItem('ripple') === 'true',
    inputStyle: localStorage.getItem('inputStyle') || 'outlined',
    menuMode: localStorage.getItem('menuMode') || 'overlay',
    colorScheme: 'dark',
    theme: 'vela-green',
    scale: +localStorage.getItem('scale') || 14,
    hideBasicAtk: localStorage.getItem('hideBasicAtk') === 'true',
  };

  state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    myProfileVisible: false,
  };

  private configUpdate = new Subject<AppConfig>();

  private overlayOpen = new Subject<any>();

  configUpdate$ = this.configUpdate.asObservable();

  overlayOpen$ = this.overlayOpen.asObservable();

  constructor() {
    this.onConfigUpdate();
  }

  onMenuToggle() {
    if (this.isOverlay()) {
      this.state.overlayMenuActive = !this.state.overlayMenuActive;
      if (this.state.overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }

    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  showProfileSidebar() {
    this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
    if (this.state.profileSidebarVisible) {
      this.overlayOpen.next(null);
    }
  }

  showConfigSidebar() {
    this.state.configSidebarVisible = true;
  }

  showMyProfileSidebar() {
    this.state.myProfileVisible = true;
  }

  isOverlay() {
    localStorage.setItem('menuMode', this.config.menuMode);

    return this.config.menuMode === 'overlay';
  }

  isDesktop() {
    // return window.innerWidth > 991;
    return true;
  }

  isMobile() {
    return !this.isDesktop();
  }

  onConfigUpdate() {
    this.configUpdate.next(this.config);
  }
}
