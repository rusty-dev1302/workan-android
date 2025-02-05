

import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule, HammerModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Routes, provideRouter, withInMemoryScrolling } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app/app.component';
import { ListingService } from './app/services/listing.service';
import { UserService } from './app/services/user.service';
import { AdminGuard } from './app/utility/admin.guard';
import { AuthGuard } from './app/utility/app.guard';
import { initializeKeycloak } from './app/utility/app.init';
import { CustomerGuard } from './app/utility/customer.guard';
import { ProfessionalGuard } from './app/utility/professional.guard';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const routes: Routes = [
  {
    path: 'firstLogin', loadComponent: () => import('./app/components/first-login/first-login.component')
      .then(c => c.FirstLoginComponent), canActivate: [AuthGuard]
  },
  // common pages
  {
    path: 'home', loadComponent: () => import('./app/components/landing-page/landing-page.component')
      .then(c => c.LandingPageComponent)
  },
  {
    path: 'disclaimer', loadComponent: () => import('./app/components/disclaimer/disclaimer.component')
      .then(c => c.DisclaimerComponent)
  },
  {
    path: 'privacyPolicy', loadComponent: () => import('./app/components/privacy-policy/privacy-policy.component')
      .then(c => c.PrivacyPolicyComponent)
  },
  {
    path: 'termsOfUse', loadComponent: () => import('./app/components/terms-of-use/terms-of-use.component')
      .then(c => c.TermsOfUseComponent)
  },
  {
    path: 'acceptableUsePolicy', loadComponent: () => import('./app/components/acceptable-use-policy/acceptable-use-policy.component')
      .then(c => c.AcceptableUsePolicyComponent)
  },
  // end of common pages 
  {
    path: 'processAddToWallet/:paymentAccountId', loadComponent: () => import('./app/components/process-add-to-wallet/process-add-to-wallet.component')
      .then(c => c.ProcessAddToWalletComponent), canActivate: [AuthGuard]
  },
  {
    path: 'completePayment/:orderId', loadComponent: () => import('./app/components/payment-gateway/payment-gateway.component')
      .then(c => c.PaymentGatewayComponent), canActivate: [AuthGuard]
  },
  {
    path: 'listings/:subcategory/:location', loadComponent: () => import('./app/components/browse-listings/browse-listings.component')
      .then(c => c.BrowseListingsComponent), canActivate: [AuthGuard]
  },
  {
    path: 'listings', loadComponent: () => import('./app/components/browse-listings/browse-listings.component')
      .then(c => c.BrowseListingsComponent), canActivate: [AuthGuard]
  },
  {
    path: 'listingDetail/:id', loadComponent: () => import('./app/components/listing-details/listing-details.component')
      .then(c => c.ListingDetailsComponent), canActivate: [AuthGuard]
  },
  {
    path: 'viewMyListing', loadComponent: () => import('./app/components/view-my-listing/view-my-listing.component')
      .then(c => c.ViewMyListingComponent), canActivate: [AuthGuard, ProfessionalGuard]
  },
  {
    path: 'admin', loadComponent: () => import('./app/components/admin-dashboard/admin-dashboard.component')
      .then(c => c.AdminDashboardComponent), canActivate: [AuthGuard],
    children: [
      {
        path: 'manageUsers', loadComponent: () => import('./app/components/manage-users/manage-users.component')
          .then(c => c.ManageUsersComponent), canActivate: [AdminGuard]
      },
      {
        path: 'manageVerifications', loadComponent: () => import('./app/components/manage-verifications/manage-verifications.component')
          .then(c => c.ManageVerificationsComponent), canActivate: [AdminGuard]
      },
    ]
  },
  {
    path: 'dashboard', loadComponent: () => import('./app/components/dashboard/dashboard.component')
      .then(c => c.DashboardComponent), canActivate: [AuthGuard],
    children: [{
      path: 'profile', loadComponent: () => import('./app/components/dashboard-profile/dashboard-profile.component')
        .then(c => c.DashboardProfileComponent)
    },
    {
      path: 'payments', loadComponent: () => import('./app/components/dashboard-payments/dashboard-payments.component')
        .then(c => c.DashboardPaymentsComponent), canActivate: [CustomerGuard]
    },
    {
      path: 'professionalPayments', loadComponent: () => import('./app/components/dashboard-payments/dashboard-payments.component')
        .then(c => c.DashboardPaymentsComponent), canActivate: [ProfessionalGuard]
    },
    {
      path: 'orders', loadComponent: () => import('./app/components/dashboard-orders/dashboard-orders.component')
        .then(c => c.DashboardOrdersComponent), canActivate: [CustomerGuard]
    },
    {
      path: 'addressDetails', loadComponent: () => import('./app/components/dashboard-address-details/dashboard-address-details.component')
        .then(c => c.DashboardAddressDetailsComponent), canActivate: [CustomerGuard]
    },
    {
      path: 'orderDetail/:id', loadComponent: () => import('./app/components/dashboard-order-details/dashboard-order-details.component')
        .then(c => c.DashboardOrderDetailsComponent), canActivate: [CustomerGuard]
    },
    {
      path: 'myorders', loadComponent: () => import('./app/components/dashboard-orders-taken/dashboard-orders-taken.component')
        .then(c => c.DashboardOrdersTakenComponent), canActivate: [ProfessionalGuard]
    },
    {
      path: 'takenOrderDetail/:id', loadComponent: () => import('./app/components/dashboard-orders-taken-details/dashboard-orders-taken-details.component')
        .then(c => c.DashboardOrdersTakenDetailsComponent), canActivate: [ProfessionalGuard]
    },
    {
      path: 'managelisting', loadComponent: () => import('./app/components/dashboard-listings/dashboard-listings.component')
        .then(c => c.DashboardListingsComponent), canActivate: [ProfessionalGuard]
    },
    {
      path: '', loadComponent: () => import('./app/components/dashboard-profile/dashboard-profile.component')
        .then(c => c.DashboardProfileComponent)
    },
    {
      path: 'offersRewards', loadComponent: () => import('./app/components/offers-and-rewards/offers-and-rewards.component')
        .then(c => c.OffersAndRewardsComponent)
    },
    ]
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];




bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(MatDialogModule, InfiniteScrollModule, ImageCropperModule, GoogleMapsModule, FormsModule, BrowserModule, OAuthModule.forRoot({
            resourceServer: {
                sendAccessToken: true
            }
        }), KeycloakAngularModule, ToastrModule.forRoot({maxOpened: 1}), NgxDaterangepickerMd.forRoot()),
        ListingService,
        UserService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService]
        },
        DatePipe,
        HammerModule,
        provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        
    ]
})
  .catch(err => console.error(err));
