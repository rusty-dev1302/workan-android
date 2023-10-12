import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Injectable({ providedIn: "root" })
export class NavigationService {
  private history: string[] = [];

  private isPageLoaded$ = new BehaviorSubject<boolean>(false);
 
  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  isPageLoaded(): Observable<boolean>{
    return this.isPageLoaded$.asObservable();
  }

  showLoader() {
    this.isPageLoaded$.next(false);
  }

  pageLoaded() {
    this.isPageLoaded$.next(true);
  }
 
  back(): void {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/");
    }
  }
}
