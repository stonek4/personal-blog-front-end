import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { FeaturedComponent } from './featured/featured.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
    { path: 'about', component: AboutMeComponent },
    { path: 'featured', component: FeaturedComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
