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
              path: '**',
              redirectTo: '',
            },
          ],
        },
        {
          path: 'login',
          loadChildren: () => import('./layout/pages/auth/auth.module').then((m) => m.AuthModule),
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
