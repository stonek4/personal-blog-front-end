import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponent } from './card/card.component';
import { FloatingButtonComponent } from './floating-button/floating-button.component';
import { NavigationBarComponent } from './navigation/navigation-bar/navigation-bar.component';
import { LoadingIconComponent } from './loading-icon/loading-icon.component';

@NgModule({
    declarations: [
        CardComponent,
        FloatingButtonComponent,
        NavigationBarComponent,
        LoadingIconComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LoadingIconComponent,
        CardComponent,
        FloatingButtonComponent,
        NavigationBarComponent
    ]
})
export class SharedComponentsModule { }
