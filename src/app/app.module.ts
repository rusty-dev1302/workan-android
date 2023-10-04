import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowseListingsComponent } from './components/browse-listings/browse-listings.component';
import { HttpClientModule } from '@angular/common/http';
import { ListingService } from './services/listing.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { ListingDetailsComponent } from './components/listing-details/listing-details.component';
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
import { BrowseListingsFilterComponent } from './components/browse-listings-filter/browse-listings-filter.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FirstLoginComponent } from './components/first-login/first-login.component';
import { PhotoUploaderComponent } from './components/photo-uploader/photo-uploader.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DatePipe } from '@angular/common';
import { DashboardOrderDetailsComponent } from './components/dashboard-order-details/dashboard-order-details.component';
import { DashboardOrdersTakenComponent } from './components/dashboard-orders-taken/dashboard-orders-taken.component';
import { DashboardOrdersTakenDetailsComponent } from './components/dashboard-orders-taken-details/dashboard-orders-taken-details.component';
import { CustomerGuard } from './utility/customer.guard';
import { ProfessionalGuard } from './utility/professional.guard';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ReviewComponent } from './components/review/review.component';
import { SelectMapLocationComponent } from './components/select-map-location/select-map-location.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { PaymentGatewayComponent } from './components/payment-gateway/payment-gateway.component';
import { ConfirmPaymentComponent } from './components/confirm-payment/confirm-payment.component';

const routes: Routes = [
  { path: 'firstLogin', component: FirstLoginComponent, canActivate: [AuthGuard] },
  // below to be removed 
  { path: 'home', component: LandingPageComponent, canActivate: [AuthGuard] },
  // above to be removed 
  { path: 'paymentGateway/:orderId', component: PaymentGatewayComponent, canActivate: [AuthGuard] },
  { path: 'listings/:subcategory/:location', component: BrowseListingsComponent, canActivate: [AuthGuard] },
  { path: 'listings', component: BrowseListingsComponent, canActivate: [AuthGuard] },
  { path: 'listingDetail/:id', component: ListingDetailsComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
          children: [{ path: 'profile', component: DashboardProfileComponent },
          { path: 'orders', component: DashboardOrdersComponent, canActivate: [CustomerGuard] },
          { path: 'orderDetail/:id', component: DashboardOrderDetailsComponent, canActivate: [CustomerGuard] },
          { path: 'myOrders', component: DashboardOrdersTakenComponent, canActivate: [ProfessionalGuard] },
          { path: 'takenOrderDetail/:id', component: DashboardOrdersTakenDetailsComponent, canActivate: [ProfessionalGuard] },
          { path: 'managelisting', component: DashboardListingsComponent, canActivate: [ProfessionalGuard] },
          { path: '', component: DashboardProfileComponent }
          ]
  },
  { path: '', redirectTo: '/listings', pathMatch: 'full' },
  { path: '**', redirectTo: '/listings', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    BrowseListingsComponent,
    SearchComponent,
    ListingDetailsComponent,
    HeaderComponent,
    DashboardComponent,
    LandingPageComponent,
    DashboardProfileComponent,
    DashboardOrdersComponent,
    DashboardListingsComponent,
    SlotSelectorComponent,
    DashboardProfileFormComponent,
    DashboardListingsFormComponent,
    BrowseListingsFilterComponent,
    SidebarComponent,
    FirstLoginComponent,
    PhotoUploaderComponent,
    DashboardOrderDetailsComponent,
    DashboardOrdersTakenComponent,
    DashboardOrdersTakenDetailsComponent,
    ReviewComponent,
    SelectMapLocationComponent,
    PaymentGatewayComponent,
    ConfirmPaymentComponent,
  ],
  imports: [
    ImageCropperModule,
    GoogleMapsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        sendAccessToken: true
      }
    }),
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
