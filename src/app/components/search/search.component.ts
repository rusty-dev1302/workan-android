import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    standalone: true,
    imports: [FormsModule]
})
export class SearchComponent implements OnInit{

  @Output() searchByEmailEvent = new EventEmitter<string>();

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }

  doSearch(value: string) {
    // this.router.navigateByUrl(`/search/${value}`);
    this.searchByEmailEvent.emit(value);
  }

}
