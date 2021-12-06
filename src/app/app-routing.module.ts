import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: AppLayoutComponent,
          children: [
            {
              path: '',
              loadChildren: () =>
                import(
                  './layout/pages/ro-calculator/ro-calculator.module'
                ).then((m) => m.RoCalculatorModule),
            },
            {
              path: 'utilities',
              loadChildren: () =>
                import('./demo/components/utilities/utilities.module').then(
                  (m) => m.UtilitiesModule
                ),
            },
            {
              path: 'blocks',
              loadChildren: () =>
                import('./demo/components/primeblocks/primeblocks.module').then(
                  (m) => m.PrimeBlocksModule
                ),
            },
          ],
        },
        {
          path: 'auth',
          loadChildren: () =>
            import('./demo/components/auth/auth.module').then(
              (m) => m.AuthModule
            ),
        },
        {
          path: 'landing',
          loadChildren: () =>
            import('./demo/components/landing/landing.module').then(
              (m) => m.LandingModule
            ),
        },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
