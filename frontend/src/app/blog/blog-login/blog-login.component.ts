/* Angular */
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
/* Third Party */
import { NGXLogger } from 'ngx-logger';
/* Custom */
import { AppHttpClientService, User } from '../../app-http-client.service';

@Component({
  selector: 'app-blog-login',
  templateUrl: './blog-login.component.html',
  styleUrls: ['./blog-login.component.scss']
})
/**
 * Small componenent that both represents the login page
 * and the stand alone login component that pops up when
 * the user is no longer authenticated.
 * @class
 */
export class BlogLoginComponent implements OnInit {

    public isLoggedIn: boolean;
    public username: string;
    public password: string;
    public errorFeedback: string;

    public constructor(private httpClient: AppHttpClientService, private router: Router, private logger: NGXLogger) {
        this.logger.info('constructing the blog login component');
        this.isLoggedIn = this.httpClient.isLoggedIn();
    }

    public ngOnInit() {
    }

    /**
     * The method called when the user submits the login form.
     * If valid, the user will be navigated to the admin page.
     * If invalid, the user will remain wherever they are.
     */
    public login() {
        this.logger.info(`logging in the user ${this.username}`);
        if (this.username !== undefined && this.password !== undefined) {
            this.httpClient.login(this.username, this.password)
            .subscribe(
                (user: User) => {
                    this.errorFeedback = '';
                    this.router.navigateByUrl('/blog/admin');
                }, (err: HttpErrorResponse) => {
                    this.errorFeedback = err.statusText.toString();
                    this.logger.warn(`an invalid login attempt was made with username: ${this.username}!`);
                }
            );
        }
    }
}
