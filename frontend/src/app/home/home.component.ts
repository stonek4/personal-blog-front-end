/* Angular */
import { Component, OnInit } from '@angular/core';
/* Third Party */
import { NGXLogger } from 'ngx-logger';
/* Custom */
import { NavigationService, NavigationOption } from '../shared-components/navigation/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
/**
 * The Home Component class used to represent the
 * home page of the application.
 * @class
 */
export class HomeComponent implements OnInit {

    public title = 'K E V I N S T O N E R . M E';
    public altTitle = 'KEVINSTONER.ME';
    public navigationOptions: NavigationOption[];

    /**
     * The constructor for the Home Page, adds the logger
     * so that things can be logged.
     * @param logger the logger used to log statements
     */
    public constructor(private logger: NGXLogger, private navigationService: NavigationService) {
        this.logger.info('constructing the home page');
        this.navigationOptions = this.navigationService.navigationOptions;
        this.navigationService.clearSelectedOptions();
    }

    public onClick(option: NavigationOption) {
        this.navigationService.selectedOption = option;
    }

    /**
     * The angular on init lifecycle method.
     */
    public ngOnInit() { }
}
