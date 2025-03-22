import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent implements OnInit {

    // constructor(private primengConfig: PrimeNGConfig) { }

    ngOnInit() {
        // this.primengConfig.ripple = true;
        console.log('TODO: primengConfig.ripple');
    }
}
