import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ListingService } from './services/listing.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { HeaderComponent } from './components/header/header.component'
import { OAuthModule } from 'angular-oauth2-oidc';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from '../app/utility/app.init'
import { AuthGuard } from './utility/app.guard';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DashboardProfileComponent } from './components/dashboard-profile/dashboard-profile.component';
import { DashboardOrdersComponent } from './components/dashboard-orders/dashboard-orders.component';
import { DashboardListingsComponent } from './components/dashboard-listings/dashboard-listings.component';
import { SlotSelectorComponent } from './components/slot-selector/slot-selector.component';
import { FormsModule } from '@angular/forms';
import { DashboardProfileFormComponent } from './components/dashboard-profile-form/dashboard-profile-form.component';
import { DashboardListingsFormComponent } from './components/dashboard-listings-form/dashboard-listings-form.component';
import { UserService } from './services/user.service';
import { ProductListFilterComponent } from './components/product-list-filter/product-list-filter.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FirstLoginComponent } from './components/first-login/first-login.component';
import { PhotoUploaderComponent } from './components/photo-uploader/photo-uploader.component';
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { DatePipe } from '@angular/common';

// function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
//   //Use injector to access router
//   const router = injector.get(Router);
//   router.navigate(['/login']);
// }

const routes: Routes = [
  { path: 'firstLogin', component: FirstLoginComponent, canActivate: [AuthGuard]},
  { path: 'home', component: LandingPageComponent, canActivate: [AuthGuard]},
  { path: 'listings/:subcategory/:location', component: ProductListComponent, canActivate: [AuthGuard]},
  { path: 'listings', component: ProductListComponent, canActivate: [AuthGuard]},
  { path: 'listingDetail/:id', component: ProductDetailsComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
                      children: [{ path: 'profile', component: DashboardProfileComponent },
                                  { path: 'myorders', component: DashboardOrdersComponent },
                                  { path: 'managelisting', component: DashboardListingsComponent },
                                  {path: '', component: DashboardProfileComponent} 
                                  ]},
  { path: '', redirectTo: '/listings', pathMatch: 'full' },
  { path: '**', redirectTo: '/listings', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    SearchComponent,
    ProductDetailsComponent,
    HeaderComponent,
    DashboardComponent,
    LandingPageComponent,
    DashboardProfileComponent,
    DashboardOrdersComponent,
    DashboardListingsComponent,
    SlotSelectorComponent,
    DashboardProfileFormComponent,
    DashboardListingsFormComponent,
    ProductListFilterComponent,
    SidebarComponent,
    FirstLoginComponent,
    PhotoUploaderComponent
  ],
  imports: [
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
          sendAccessToken: true
      }}),
      KeycloakAngularModule,
      ToastrModule.forRoot(),
      BrowserAnimationsModule
  ],
  providers: [
    ListingService,
    UserService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
