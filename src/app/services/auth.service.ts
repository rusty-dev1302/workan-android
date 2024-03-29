import { Injectable } from '@angular/core';
import { User, UserManager } from 'oidc-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userManager: UserManager; 
  private _user!: User;

  stsSettings = {
    authority: environment.keycloak.issuer,
    client_id: environment.keycloak.clientId,
    redirect_url: environment.keycloak.redirectUri,
    scope: environment.keycloak.scope
  }

  constructor() { 
    this._userManager = new UserManager(this.stsSettings);
  }

  login() {
    return this._userManager.signinRedirect();
  }

  isLoggedIn(): Promise<boolean> {
    return this._userManager.getUser().then(user => {
      const userCurrent = !!user && !user.expired;
      return userCurrent;
    });
  }
}
