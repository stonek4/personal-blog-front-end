import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService, NavigationOption, NavigationOptions } from '../navigation.service';
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'app-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss']
})
/**
 * The navigation bar shown at the top of the screen
 * on non-home pages
 */
export class NavigationBarComponent implements OnInit {

    /**
     * The list of navigation options
     */
    public navigationOptions: NavigationOption[];

    /**
     * The option for the user to go back (either home
     * or to the blog home)
     */
    public backOption = new NavigationOption({
        name: 'Home',
        icon: '\ue117',
        route: 'home'
    });

    public constructor(private router: Router, public navigationService: NavigationService, private logger: NGXLogger) {
        this.logger.info('constructing the navigation bar');
        this.navigationOptions = this.navigationService.navigationOptions;
    }

    ngOnInit() {
    }

    /**
     * What happens on back click.  If the user is in the
     * blog then this will take them to the blog home, otherwise
     * this will take them to the main home page
     */
    public onBackClick() {
        this.logger.info('navigation option was clicked');
        const re = new RegExp('.*' + NavigationOptions.Blog.route + '\/.+');
        if (re.test(this.router.url)) {
            this.navigationService.selectedOption = NavigationOptions.Blog;
        } else {
            this.navigationService.selectedOption = this.backOption;
        }
    }

    /**
     * When the user clicks a navigation option it will
     * select that option in the navigation service (which
     * will route the user there)
     * @param option the option that was clicked
     */
    public onClick(option: NavigationOption) {
        this.logger.info('navigation option was clicked');
        this.navigationService.selectedOption = option;
    }
}
