/* Angular */
import { Component, OnInit } from '@angular/core';
/* Third Party */
import { NGXLogger } from 'ngx-logger';
/* Custom */
import { NavigationService, NavigationOptions } from '../shared-components/navigation/navigation.service';

@Component({
    selector: 'app-featured',
    templateUrl: './featured.component.html',
    styleUrls: ['./featured.component.scss']
})
/**
 * Simple class for the featured page
 * @class
 */
export class FeaturedComponent implements OnInit {

    constructor(
        private navigationService: NavigationService,
        private logger: NGXLogger
    ) {
        this.logger.info('constructing the featured page');
        this.navigationService.selectedOption = NavigationOptions.Featured;
    }

    ngOnInit() {
    }
}
