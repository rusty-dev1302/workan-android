import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService} from 'keycloak-angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  isFirstLogin: boolean = false;

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
