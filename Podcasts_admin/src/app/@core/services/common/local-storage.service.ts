import { Injectable } from '@angular/core';
import {AbstractStorageAdapter} from "./storage-adapter.service";

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService extends AbstractStorageAdapter {
  

  /**
   * Custom localStorage.getItem
   */
  getItem<T>(key: string): T {
    const dataString = localStorage.getItem(key);
    if (!dataString) {
        return null;
    }
    try {
        const data = JSON.parse(dataString);
        return data;
    } catch (error) {
        console.error('Error parsing JSON from Local Storage:', error);
        return null;
    }
}

  /**
   * Custom localStorage.setItem
   */
  setItem(key: string, value: any): void {
    const data = JSON.stringify(value);
    localStorage.setItem(key, data);
  }

  /**
   * Custom localStorage.removeItem
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
