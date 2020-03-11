/* Angular */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
/* Third Party */
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'app-floating-button',
    templateUrl: './floating-button.component.html',
    styleUrls: ['./floating-button.component.scss']
})
export class FloatingButtonComponent implements OnInit {

    private isDisabled = false;
    private transitionEndEvent = 'transitionend';

    @Input() buttonText = 'I\'m a Button!';
    @Input() buttonIcon = '';
    @Input() buttonType = 'submit';
    @Output() clicked = new EventEmitter<void>();

    /**
     * The constructor for the floating button, adds the logger
     * so that things can be logged.
     * @param logger the logger used to log statements
     */
    public constructor(private logger: NGXLogger) {
        this.logger.info('constructing a floating button');
    }

    public ngOnInit() {
    }

    /**
     * An Angular event handler triggered by a user clicking on the floating
     * button element in the DOM.  It simply delays ever so slightly before navigating.
     * @param event the click event of the user clicking on the business card
     */
    public onClick(event: any) {
        this.logger.info('floating button clicked');
        const buttonElement: HTMLElement = event.currentTarget;

        if (!this.isDisabled) {
            this.logger.info('disabling button and adding transition event listener');
            this.isDisabled = true;
            buttonElement.addEventListener(this.transitionEndEvent, this.transitionEndHandler);
        }
    }

    /**
     * An event handler triggered by a transition ending on the floating button element
     * @param event the transition end event of the business card
     */
    private transitionEndHandler = (event: any) => {
        this.logger.info('enabling button and removing transition event listener');
        event.currentTarget.removeEventListener(this.transitionEndEvent, this.transitionEndHandler);
        this.isDisabled = false;
        this.clicked.emit();
    }

}
