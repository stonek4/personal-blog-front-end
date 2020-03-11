import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogHomeComponent } from './blog-home/blog-home.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { BlogLoginComponent } from './blog-login/blog-login.component';
import { BlogAdminComponent } from './blog-admin/blog-admin.component';

const routes: Routes = [
    { path: 'login', component: BlogLoginComponent },
    { path: 'admin', component: BlogAdminComponent },
    { path: ':id', component: BlogPostComponent },
    { path: '', component: BlogHomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
