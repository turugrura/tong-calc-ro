import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
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
                import('./layout/pages/ro-calculator/ro-calculator.module').then((m) => m.RoCalculatorModule),
            },
            {
              path: 'shared-presets',
              loadChildren: () =>
                import('./layout/pages/shared-preset/shared-preset.module').then((m) => m.SharedPresetModule),
            },
            {
              path: 'preset-summary',
              loadChildren: () =>
                import('./layout/pages/preset-summary/preset-summary.module').then((m) => m.PresetSummaryModule),
            },
            {
              path: 'marketplace',
              loadChildren: () =>
                import('./layout/pages/marketplace/marketplace.module').then((m) => m.MarketplaceModule),
            },
          ],
        },
        {
          path: 'login',
          loadChildren: () => import('./layout/pages/auth/auth.module').then((m) => m.AuthModule),
        },
        {
          path: '**',
          redirectTo: '',
        },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
