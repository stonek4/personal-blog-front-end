/* Angular */
import { Component, OnInit } from '@angular/core';
/* Third Party */
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'app-business-card',
    templateUrl: './business-card.component.html',
    styleUrls: ['./business-card.component.scss']
})
/**
 * A class representing the Business Card.  It adds and removes CSS classes
 * to get the card to flip on click.
 * @class
 */
export class BusinessCardComponent implements OnInit {

    private isDisabled = false;
    private isFlipped = false;
    private flippedClass = 'is-flipped';
    private flippedBackClass = 'is-flipped-back';
    private animationEndEvent = 'animationend';

    /**
     * The constructor for the Business Card, adds the logger
     * so that things can be logged.
     * @param logger the logger used to log statements
     */
    public constructor(private logger: NGXLogger) {
        this.logger.debug('constructing the business card');
    }

    /**
     * The angular on init lifecycle method.
     */
    public ngOnInit() {
    }

    /**
     * An Angular event handler triggered by a user clicking on the business
     * card element in the DOM.  It adds and removes flip classes causing
     * the business card to animate.
     * @param event the click event of the user clicking on the business card
     */
    public onClick(event: any) {
        this.logger.debug('business card clicked');
        const cardDOMElement: HTMLElement = event.currentTarget;

        if (!this.isDisabled) {
            this.logger.debug('disabling business card and adding animation event listener');
            this.isDisabled = true;
            cardDOMElement.addEventListener(this.animationEndEvent, this.animationEndHandler);

            if (!this.isFlipped) {
                this.logger.debug('flipping business card');
                cardDOMElement.classList.add(this.flippedClass);
                cardDOMElement.classList.remove(this.flippedBackClass);
                this.isFlipped = true;
            } else {
                this.logger.debug('flipping back business card');
                cardDOMElement.classList.add(this.flippedBackClass);
                cardDOMElement.classList.remove(this.flippedClass);
                this.isFlipped = false;
            }
        }
    }

    /**
     * An event handler triggered by an animation ending on the business card element
     * @param event the animation end event of the business card
     */
    private animationEndHandler = (event: any) => {
        this.logger.debug('enabling business card and removing animation event listener');
        event.currentTarget.removeEventListener(this.animationEndEvent, this.animationEndHandler);
        this.isDisabled = false;
    }
}
