import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular-workan';
  isPageLoaded:boolean = false;

  constructor(
    private navigationService: NavigationService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.navigationService.isPageLoaded().subscribe(
      (response) => {
        this.isPageLoaded = response;
      }
    );
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}
