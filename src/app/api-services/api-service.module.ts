import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PresetService } from './preset.service';

@NgModule({ exports: [], imports: [], providers: [AuthService, PresetService, provideHttpClient(withInterceptorsFromDi())] })
export class ApiServiceModule {}
