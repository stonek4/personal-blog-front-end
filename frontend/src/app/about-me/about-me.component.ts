/* Angular */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
/* Third Party */
import { NGXLogger } from 'ngx-logger';
/* Custom */
import { NavigationService, NavigationOptions } from '../shared-components/navigation/navigation.service';
import { ShowdownService } from '../shared-components/showdown/showdown.service';
import { AppHttpClientService, BlogPost } from '../app-http-client.service';

@Component({
    selector: 'app-about-me',
    templateUrl: './about-me.component.html',
    styleUrls: ['./about-me.component.scss', '../blog/blog.scss'],
    encapsulation: ViewEncapsulation.None
})
/**
 * Simple class for the about me page
 * @class
 */
export class AboutMeComponent implements OnInit {

    private aboutPostId = '5d082835a9b0c33f2c4dbc43';
    public title = '';
    public renderedContent = '';
    public errorFeedback = '';

    constructor(
        private navigationService: NavigationService,
        private logger: NGXLogger,
        private converer: ShowdownService,
        private httpClient: AppHttpClientService
    ) {
        this.logger.info('constructing the about me page');
        this.navigationService.selectedOption = NavigationOptions.About;
    }

    /**
     * Lifecycle method for when the component is intialized.
     * Gets the "About Me" blog post from the server.
     */
    ngOnInit() {
        this.logger.info('getting the about me blog post from the server');
        this.httpClient.getBlogPost(this.aboutPostId).subscribe(
            (post: BlogPost) => {
                this.title = post.title;
                this.renderedContent = this.converer.makeHtml(post.content);
            }, (err: HttpErrorResponse) => {
                this.renderedContent = err.statusText;
            }
        );
    }
}
