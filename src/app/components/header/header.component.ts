import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService} from 'keycloak-angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  @Input()
  isAuthenticated: boolean = false;

  isFirstLogin: boolean = false;

  notificationCount:string = "0";


  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.getIsFirstLogin().subscribe(
      (isFirstLogin) => {
        this.isFirstLogin = isFirstLogin;
        if(this.isFirstLogin) {
          this.router.navigateByUrl(`/firstLogin`);
        }
      }
    );
    this.userService.updateFirstLogin();
  }

}
