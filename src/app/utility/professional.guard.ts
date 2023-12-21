import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { UserService } from '../services/user.service';
import { KeycloakService } from 'keycloak-angular';
import { Observable, map } from 'rxjs';
import { constants } from 'src/environments/constants';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalGuard {
  constructor(
    protected router: Router,
    private userService: UserService,
    private keycloakService: KeycloakService,
  ) {
  }

  canActivate(): Observable<boolean>  {
    return this.userService.getUserByEmail(this.keycloakService.getUsername()).pipe(
        map((user) => {
          if(user.state!=constants.ERROR_STATE) {
            if(user.professional&&!user.admin) {
                return true;   
            }
          }
          return false;
        })
      );  
    }
  
}