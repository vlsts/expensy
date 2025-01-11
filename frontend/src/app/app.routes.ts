import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { component: ProfileComponent, path: "profile", pathMatch: "full" },
// { component: AppComponent, path: "**", pathMatch: "full" }
];
