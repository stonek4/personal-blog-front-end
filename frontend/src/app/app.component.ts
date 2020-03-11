import { Component } from '@angular/core';
import { fadeAnimation } from './app.animations';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [fadeAnimation]
})
/**
 * The main Angular component
 */
export class AppComponent {
    constructor() { }
    title = 'Kevin Stoner';
}
