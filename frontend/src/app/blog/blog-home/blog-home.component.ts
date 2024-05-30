/* Angular */
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
/* Third Party */
import { NGXLogger } from 'ngx-logger';
import removeMd from 'remove-markdown';
/* Custom */
import { NavigationService, NavigationOptions } from '../../shared-components/navigation/navigation.service';
import { AppHttpClientService, BlogPost } from '../../app-http-client.service';

@Component({
    selector: 'app-blog-home',
    templateUrl: './blog-home.component.html',
    styleUrls: ['./blog-home.component.scss', '../blog.scss']
})
/**
 * Class for the blog home, shows a bunch of blog posts for users to click on
 * @class
 */
export class BlogHomeComponent implements OnInit {

    public blogPosts: BlogPost[];
    public errorFeedback: string;
    private year = 2019;

    public constructor(
        private navigationService: NavigationService,
        private logger: NGXLogger,
        private httpClient: AppHttpClientService,
        private router: Router
    ) {
        this.logger.info('constructing the blog page');
        this.navigationService.selectedOption = NavigationOptions.Blog;
    }

    /**
     * Lifecycle method for when the component is intialized.
     * Loads all of the blog posts for a certain time period
     * FIXME: allow more blog posts to be loaded
     */
    public ngOnInit() {
        this.logger.info(`getting the blog posts for ${this.year}`);
        this.httpClient.getBlogPostsByDate(this.year).subscribe(
            (posts) => {
                this.blogPosts = posts.map((post) => {
                    post.content = removeMd(post.content);
                    return post;
                });
            }, (err: HttpErrorResponse) => {
                this.errorFeedback = err.statusText;
            }
        );
    }

    /**
     * called when a user clicks on a blog post, simply navigates to that post
     * @param id the id of the blog post that the user clicked on
     */
    public onClick(id: string) {
        this.logger.info(`navigating to the page of the user selected blog: ${id}`);
        this.router.navigateByUrl('/blog/' + id);
    }
}
