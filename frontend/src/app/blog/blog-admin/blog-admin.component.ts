/* Angular */
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
/* Third Party */
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
/* Custom */
import { AppHttpClientService, User, BlogPost } from '../../app-http-client.service';
import { ShowdownService } from '../../shared-components/showdown/showdown.service';


@Component({
  selector: 'app-blog-admin',
  templateUrl: './blog-admin.component.html',
  styleUrls: ['./blog-admin.component.scss', '../blog.scss']
})
/**
 * Secret admin page class.  Used for adding, editing, and deleting posts.
 * @class
 */
export class BlogAdminComponent implements OnInit {

    public blogId: string;
    public title: string;
    public content: string;
    public tags: string;
    public errorFeedback: string;
    public readonly currentDate = (new Date()).toDateString();

    public constructor(
        public httpClient: AppHttpClientService,
        public converter: ShowdownService,
        private router: Router,
        private logger: NGXLogger
    ) {
        this.logger.info('constructing the blog admin page');
    }

    public ngOnInit() {
    }

    /**
     * Given the user entered blog ID, loads the relevant blog.
     */
    public load() {
        this.logger.info(`loading the blog post for ID: ${this.blogId}`);
        if (this.blogId === undefined) {
            return;
        }
        this.httpClient.getBlogPost(this.blogId).subscribe(
            (post: BlogPost) => {
                this.title = post.title;
                this.content = post.content;
                this.tags = post.tags.join();
            }, (err: HttpErrorResponse) => {
                this.errorFeedback = err.statusText;
            }
        );
    }

    /**
     * Takes the user entered information and attempts to add/update the blog post.
     * If the Blog ID is undefined or an empty string, then a POST request will be made,
     * otherwise a PUT request to the Blog ID will be made.
     */
    public upsert() {
        const user: User = this.httpClient.getLoggedInUser();
        let email = '';
        if (user !== undefined) {
            email = user.email;
        }
        let observable: Observable<BlogPost>;
        if (this.blogId === undefined || this.blogId === '') {
            this.logger.info(`creating a new blog post.`);
            observable = this.httpClient.createBlogPost(email, this.title, this.content, this.tags.split(','));
        } else {
            this.logger.info(`updating the blog post for ID: ${this.blogId}`);
            observable = this.httpClient.updateBlogPost(this.blogId, email, this.title, this.content, this.tags.split(','));
        }
        observable.subscribe(
            (post: BlogPost) => {
                this.router.navigateByUrl('/blog/' + post.id);
            }, (err: HttpErrorResponse) => {
                this.errorFeedback = err.statusText;
            }
        );
    }

    /**
     * Deletes a blog post based on the user entered blog ID.
     */
    public delete() {
        this.logger.info(`Deleting the blog post for ID: ${this.blogId}`);
        if (this.blogId === undefined) {
            return;
        }
        this.httpClient.deleteBlogPost(this.blogId).subscribe(
            () => {
                this.blogId = '';
                this.title = '';
                this.content = '';
                this.tags = '';
            }, (err: HttpErrorResponse) => {
                this.errorFeedback = err.statusText;
            }
        );
    }

}
