/* Angular */
import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
/* Third Party */
import { NGXLogger } from 'ngx-logger';
/* Custom */
import { AppHttpClientService, Comment } from '../../../app-http-client.service';

@Component({
    selector: 'app-comment-section',
    templateUrl: './comment-section.component.html',
    styleUrls: ['./comment-section.component.scss']
})
/**
 * Class for the blog home, shows a bunch of blog posts for users to click on
 * @class
 */
export class CommentSectionComponent implements OnInit {

    public comments: Comment[];
    public errorFeedback: string;
    public name: string;
    public content: string;
    @Input() postId = '';

    public constructor(
        private logger: NGXLogger,
        private httpClient: AppHttpClientService,
        private router: Router
    ) {
        this.logger.info('constructing the comment section');
    }

    /**
     * Lifecycle method for when the component is intialized.
     * Loads all of the comments for a specific post
     */
    public ngOnInit() {
        this.logger.info(`getting the comments for ${this.postId}`);
        this.httpClient.getBlogPostComments(this.postId).subscribe(
            (comments: Comment[]) => {
                this.comments = comments;
            }, (err: HttpErrorResponse) => {
                this.errorFeedback = err.statusText;
            }
        );
    }

    /**
     * Called when the user submits the comment form,
     * posts a comment and then clears out the form if successful
     */
    public postComment() {
        this.httpClient.createComment(this.postId, this.name, this.content)
        .subscribe(
            (comment: Comment) => {
                this.comments.unshift(comment);
                this.name = '';
                this.content = '';
            }, (err: HttpErrorResponse) => {
                this.errorFeedback = err.statusText;
            }
        );
    }
}
