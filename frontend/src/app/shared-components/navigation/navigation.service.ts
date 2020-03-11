import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
/**
 * Special service used to navigate from page
 * to page. Keeps track of the selected navigation
 * option and holds all of the different
 * major navigation options.
 * @class
 */
export class NavigationService {

    public constructor(private router: Router, private logger: NGXLogger, private location: Location) { }

    /**
     * List of navigation options mainly used internally
     * to keep track of what is selected.
     */
    public readonly navigationOptions: NavigationOption[] = [
        NavigationOptions.About,
        NavigationOptions.Blog,
        NavigationOptions.LinkedIn,
        NavigationOptions.GitHub,
        NavigationOptions.Featured
    ];

    /**
     * Whether or not to display navigation options to
     * the user.
     */
    public displayNavigation: boolean;

    /**
     * Get the currently selected navigation option.
     */
    public get selectedOption(): NavigationOption {
        for (const option of this.navigationOptions) {
            if (option.isSelected) {
                return option;
            }
        }
    }

    /**
     * Set the selected navigation option,
     * selects the option in the list and then
     * navigates to it.
     */
    public set selectedOption(selectedOption: NavigationOption) {
        if (selectedOption.url !== undefined) {
            window.location.href = selectedOption.url;
        } else if (selectedOption.route !== undefined) {
            this.selectOption(selectedOption);
            this.router.navigateByUrl(selectedOption.route);
        } else {
            this.selectOption(selectedOption);
            this.location.back();
        }
    }

    /**
     * Select a navigation option from the list
     * @param selectedOption the option to select
     */
    private selectOption(selectedOption: NavigationOption) {
        let foundOption = false;
        this.logger.info(`selected navigation option ${selectedOption.name}`);
        selectedOption.isSelected = true;
        for (const option of this.navigationOptions) {
            if (selectedOption.name === option.name) {
                foundOption = true;
            } else {
                if (option.isSelected) {
                    option.isSelected = false;
                }
            }
        }
        this.displayNavigation = foundOption;
    }

    /**
     * Select option without navigating, simply selects
     * an option without navigating to it
     * @param selectedOption the option to select
     */
    public selectOptionWithoutNavigating(selectedOption: NavigationOption) {
        this.selectOption(selectedOption);
    }

    /**
     * Clears the selected options in the list
     */
    public clearSelectedOptions() {
        for (const option of this.navigationOptions) {
            if (option.isSelected) {
                option.isSelected = false;
                this.displayNavigation = false;
            }
        }
    }
}

/**
 * A class representing a navigation option,
 * in other words a route the user
 * can navigate to.
 */
export class NavigationOption {
    public readonly name: string;
    public readonly icon: string;
    public readonly url: string;
    public readonly route: string;
    private selected = false;

    /**
     * Whether or not this option is
     * currently selected
     */
    public get isSelected(): boolean {
        return this.selected;
    }

    /**
     * Set this option as selected
     */
    public set isSelected(value: boolean) {
        this.selected = value;
    }

    public constructor(attrs: any) {
        Object.assign(this, attrs);
    }
}

/**
 * The namespace of navigation options that
 * are available in this application.
 */
/* tslint:disable-next-line:no-namespace */
export namespace NavigationOptions {
    export const About = new NavigationOption({
        name: 'About Me',
        icon: '\ue065',
        route: 'about'
    });
    export const Blog = new NavigationOption({
        name: 'Blog',
        icon: '\ue064',
        route: 'blog'
    });
    export const LinkedIn = new NavigationOption({
        name: 'LinkedIn',
        icon: '\ue03e',
        url: 'https://www.linkedin.com/in/stonek4/'
    });
    export const GitHub = new NavigationOption({
        name: 'GitHub',
        icon: '\ue042',
        url: 'https://github.com/stonek4/'
    });
    export const Featured = new NavigationOption({
        name: 'Featured Project',
        icon: '\ue026',
        route: 'featured'
    });
}
