/* Angular */
import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
/* Third party */
import { Observable, pipe } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
/* Custom */
import { environment } from '../environments/environment';

/**
 * An interface representing the user object returned
 * by the API
 */
export interface User {
    id: string;
    email: string;
    token: string;
    expires_in: number;
}

/**
 * An interface representing the Blog Post object returned
 * by the API
 */
export interface BlogPost {
    id: string;
    email: string;
    title: string;
    content: string;
    created: string;
    modified: string;
    tags: string[];
    likes: number;
}

/**
 * An interface representing the Comment object returned
 * by the API
 */
export interface Comment {
    id: string;
    name: string;
    content: string;
    created: string;
}

@Injectable({
    providedIn: 'root'
})
/**
 * The http client service that makes calls
 * to the API for the entire application
 * @class
 */
export class AppHttpClientService {
    /** The url to make API calls to,  */
    private url = environment.apiUrl;
    /** The currently logged in user */
    private loggedInUser: User;

    public constructor(private http: HttpClient, private logger: NGXLogger) {
        this.logger.info('constructing blog http client service');
    }

    /**
     * Login to the blog using credentials
     * @param email the username
     * @param password the password
     * @returns the logged in user
     */
    public login(email: string, password: string ): Observable<User> {
        return this.http.post<User>(`${this.url}/api/users/login`, {email, password})
        .pipe(
            tap(
                user => this.saveToken(user)
            )
        );
    }

    /**
     * Logout from the blog (simply wipes localstorage)
     */
    public logout() {
        this.clearToken();
    }

    /**
     * Create a new blog post
     * @param email email of the user that wrote the post
     * @param title title of the blog post
     * @param content the actual blog post itself
     * @param tags a list of tags for sorting
     * @returns the newly created blog post
     */
    public createBlogPost(email: string, title: string, content: string, tags: string[]) {
        return this.http.post<BlogPost>(`${this.url}/api/posts`, {email, title, content, tags})
        .pipe(
            this.transformBlogPost()
        );
    }

    /**
     * Delete a blog post
     * @param id id of the blog post to delete
     */
    public deleteBlogPost(id: string) {
        return this.http.delete<void>(`${this.url}/api/posts/${id}`);
    }

    /**
     * Update a blog post
     * @param id id of the blog post to update (this cannot change)
     * @param email email of the user that wrote the post
     * @param title title of the blog post
     * @param content the actual blog post itself
     * @param tags a list of tags for sorting
     * @returns the updated blog post
     */
    public updateBlogPost(id: string, email: string, title: string, content: string, tags: string[]) {
        return this.http.put<BlogPost>(`${this.url}/api/posts/${id}`, {email, title, content, tags})
        .pipe(
            this.transformBlogPost()
        );
    }

    /**
     * Adds a like to a blog post... can be done as many times as someone wants
     * but eventually they will hit the request limit if they get carried away
     * @param id id of the blog post to like
     * @returns nothing
     */
    public likeBlogPost(id: string) {
        return this.http.put<void>(`${this.url}/api/posts/${id}/like`, {});
    }

    /**
     * Get a blog post by id
     * @param id id of the blog post to get
     * @returns the blog post matching the id
     */
    public getBlogPost(id: string): Observable<BlogPost> {
        return this.http.get<BlogPost>(`${this.url}/api/posts/${id}`).pipe(
            this.transformBlogPost()
        );
    }

    /**
     * Create a new comment
     * @param postId the post to file the comment under
     * @param name the name of the person posting... or whatever else they wanted to put here
     * @param content the comment itself
     */
    public createComment(postId: string, name: string, content: string) {
        return this.http.post<Comment>(`${this.url}/api/posts/${postId}/comments`, {name, content})
        .pipe(
            this.transformComment()
        );
    }

    public getBlogPostComments(id: string) {
        return this.http.get<Comment[]>(`${this.url}/api/posts/${id}/comments`)
        .pipe(
            map((comments: Comment[]) => {
                comments.sort(this.sortByDate);
                return comments.map(this.commentDateMap);
            })
        );
    }

    /**
     * Get a blog post by a date
     * @param year the year to get posts for
     * @param month (optional) the month to get posts for
     * @param day (optional) the day to get posts for
     * @returns a list of blog posts in the range
     */
    public getBlogPostsByDate(year: number, month?: number, day?: number): Observable<BlogPost[]> {
        let dateString = year.toString();
        if (month !== undefined) {
            dateString = dateString + `-${month}`;
            if (day !== undefined) {
                dateString = dateString + `-${day}`;
            }
        }
        return this.http.get<BlogPost[]>(`${this.url}/api/posts/date/${dateString}`)
        .pipe(
            map((posts: BlogPost[]) => {
                posts.sort(this.sortByDate);
                return posts.map(this.blogPostDateMap);
            })
        );
    }

    /**
     * Simple method to sort two posts or comments by dates (or a post
     * and a comment if you're into that sort of thing, I won't judge)
     */
    private sortByDate = (a: BlogPost | Comment, b: BlogPost | Comment) => {
        if (new Date(a.created) > new Date(b.created)) {
            return -1;
        }
        return 1;
    }

    /**
     * Save the JWT after the user authenticates and
     * set the expiration date based on the token.
     * @param user the user object from the API after logging in
     */
    private saveToken(user: User) {
        this.loggedInUser = user;
        window.localStorage.setItem('token', user.token);
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + user.expires_in);
        window.localStorage.setItem('expires_at', expiration.toISOString());
    }

    /**
     * Whether or not a user is currently logged in
     * @returns true if the user is logged in, false if not
     */
    public isLoggedIn() {
        const expiration = window.localStorage.getItem('expires_at');
        if (expiration !== null) {
            return (new Date() < new Date(expiration));
        }
        return false;
    }

    /**
     * The currently logged in user
     * @returns the currently logged in user, undefined if none
     */
    public getLoggedInUser(): User {
        return this.loggedInUser;
    }

    /**
     * Clear the token from local storage
     */
    private clearToken() {
        this.loggedInUser = undefined;
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('expires_at');
    }

    /**
     * Makes transformations to the blog post before returning it
     * @returns the converted blog post
     */
    private transformBlogPost = () => {
        return pipe(
            map(this.blogPostDateMap)
        );
    }

    /**
     * A map method to convert the dates on a blog post...
     * probably not necessary but oh so DRY
     */
    private blogPostDateMap = (post: BlogPost) => {
        post.created = this.convertDateString(post.created);
        post.modified = this.convertDateString(post.modified);
        return post;
    }

    /**
     * Makes transformations to the comment before returning it
     * @returns the converted comment
     */
    private transformComment = () => {
        return pipe(
            map(this.commentDateMap)
        );
    }

    /**
     * A map method to convert the dates on a comment...
     * probably not necessary but oh so DRY
     */
    private commentDateMap = (comment: Comment) => {
        comment.created = this.convertDateString(comment.created);
        return comment;
    }

    /**
     * Converts date strings to human readable ones
     * @param date the date string to convert dates for
     * @returns the converted date
     */
    private convertDateString(dateString: string) {
        return (new Date(dateString)).toDateString();
    }
}


@Injectable()
/**
 * Interceptor class to add the JWT to outgoing requests before
 * they are sent off.
 * @class
 */
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization',
                    'Bearer ' + token)
            });

            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}

/**
 * Interceptor to handle HTTPErrorResponses that come
 * back from the API (pretty much just logs them and passes
 * them on)
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private logger: NGXLogger) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
        .pipe(
            tap((event) => {},
                (err) => {
                    if (err instanceof HttpErrorResponse) {
                        this.logger.warn(
                            `${request.method} ${request.urlWithParams} failed due to ${err.status} ${err.statusText}`
                        );
                    }
                }
            )
        );
    }
}
