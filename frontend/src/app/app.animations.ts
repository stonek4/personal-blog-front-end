import {
    animate,
    style,
    query,
    trigger,
    transition
} from '@angular/animations';

/**
 * Angular animation to fade in and out pages as users
 * navigate between them
 */
export const fadeAnimation = trigger('fadeAnimation', [
    transition('* => *', [
        query(':enter', [style({ opacity: 0 })], { optional: true }),
        query(':leave', [style({ opacity: 1 }), animate('0.4s', style({ opacity: 0 }))], { optional: true }),
        query(':enter', [style({ opacity: 0 }), animate('0.4s', style({ opacity: 1 }))], { optional: true })
    ])
]);
