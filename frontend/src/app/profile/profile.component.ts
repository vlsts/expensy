import { Component } from "@angular/core";
import Corbado from "@corbado/web-js";
import { SessionUser } from "@corbado/types";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-profile",
  imports: [RouterOutlet],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
  user: SessionUser | undefined = undefined;

  constructor() {}

  async ngOnInit() {
    // Load and initialize Corbado SDK when component mounts
    await Corbado.load({
      projectId: "pro-9274187161272909532",
      darkMode: "off",
    });
    // Get the user data from the Corbado SDK
    this.user = Corbado.user;
  }

  async sendRequest() {
    const response = await fetch("http://localhost/users/", {
      headers: {
        Authorization: `Bearer ${Corbado.sessionToken}`,
      },
    });
  }
}
