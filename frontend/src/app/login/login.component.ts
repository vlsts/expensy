import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import Corbado from "@corbado/web-js/";

@Component({
  selector: "app-login",
  imports: [],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
  @ViewChild("corbadoAuth", { static: true }) authElement!: ElementRef;

  constructor(private router: Router) {}

  async ngOnInit() {
    // Load and initialize Corbado SDK when the component mounts
    await Corbado.load({
      projectId: "pro-9274187161272909532",
      darkMode: "off",
    });
    // mount Corbado auth UI for the user to sign in or sign up
    Corbado.mountAuthUI(this.authElement.nativeElement, {
      onLoggedIn: () => {
        this.router.navigateByUrl("/profile");
      },
    });
  }
}
