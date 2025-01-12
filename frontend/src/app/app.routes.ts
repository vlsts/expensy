import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";

export const routes: Routes = [
  { component: ProfileComponent, path: "profile", pathMatch: "full" },
  { component: HomeComponent, path: "home", pathMatch: "full" },
  { component: LoginComponent, path: "login", pathMatch: "full" },
  { component: HomeComponent, path: "**", pathMatch: "full" },
];
