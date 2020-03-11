/* Angular */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
/* Third Party */
import { switchMap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
/* Custom */
import { NavigationService, NavigationOptions } from '../../shared-components/navigation/navigation.service';
import { ShowdownService } from '../../shared-components/showdown/showdown.service';
import { AppHttpClientService, BlogPost } from '../../app-http-client.service';

@Component({
    selector: 'app-blog-post',
    templateUrl: './blog-post.component.html',
    styleUrls: ['./blog-post.component.scss', '../blog.scss'],
    encapsulation: ViewEncapsulation.None
})
/**
 * Represents a single blog post.  Displays a rendered version of the content.
 * @class
 */
export class BlogPostComponent implements OnInit {

    public errorFeedback: string;
    public title = '';
    public date = '';
    public renderedContent = '';
    public postId = '';
    public likeCount = 0;
    public likesDisabled = false;

    public constructor(
        private navigationService: NavigationService,
        private converter: ShowdownService,
        private logger: NGXLogger,
        private route: ActivatedRoute,
        private httpClient: AppHttpClientService
    ) {
        this.logger.info('constructing the blog post page');
        this.navigationService.selectOptionWithoutNavigating(NavigationOptions.Blog);
    }

    /**
     * Lifecycle method for when the component is intialized.
     * Loads the post that the user wants to look at.
     */
    public ngOnInit() {
        const postObservable = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
                this.postId = params.get('id');
                return this.httpClient.getBlogPost(this.postId);
            })
        );
        postObservable
        .subscribe(
            (post: BlogPost) => {
                this.title = post.title;
                this.date = post.created;
                this.likeCount = post.likes;
                this.renderedContent = this.converter.makeHtml(post.content);
            }, (err: HttpErrorResponse) => {
                this.errorFeedback = err.statusText;
            }
        );
    }

    /**
     * Click handler for liking a post
     */
    public likePost(event: any) {
        console.log(event);
        if (this.likesDisabled) {
            return;
        }
        this.httpClient.likeBlogPost(this.postId)
        .subscribe(
            () => {
                this.likeCount += 1;
                const icon: HTMLElement = event.target;
                console.log(icon);
                icon.classList.add('blog-post-icon-disabled');
                this.likesDisabled = true;
            }
        );
    }
}
