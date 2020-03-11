import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogHomeComponent } from './blog-home/blog-home.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { BlogLoginComponent } from './blog-login/blog-login.component';
import { BlogAdminComponent } from './blog-admin/blog-admin.component';
import { CommentSectionComponent } from './blog-post/comment-section/comment-section.component';

@NgModule({
    declarations: [
        BlogHomeComponent,
        BlogPostComponent,
        BlogLoginComponent,
        BlogAdminComponent,
        CommentSectionComponent
    ],
    imports: [
        CommonModule,
        BlogRoutingModule,
        SharedComponentsModule,
        FormsModule
    ]
})
export class BlogModule { }
