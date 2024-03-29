import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
