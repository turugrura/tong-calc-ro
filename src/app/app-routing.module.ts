import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/component/app.layout';

export const appRoutes = [
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
