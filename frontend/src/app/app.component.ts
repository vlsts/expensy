import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Corbado from '@corbado/web-js';
import {Router, RouterOutlet} from "@angular/router";
 
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    @ViewChild('corbadoAuth', {static: true}) authElement!: ElementRef;
 
    constructor(private router: Router) {
    }
 
    async ngOnInit() {
        // Load and initialize Corbado SDK when the component mounts
        await Corbado.load({
            projectId: "pro-9274187161272909532",
            darkMode: 'off',
        });
        // mount Corbado auth UI for the user to sign in or sign up
        Corbado.mountAuthUI(this.authElement.nativeElement, {
            onLoggedIn: () => {
                this.router.navigate(['/profile'])
            },
        })
    }
}
