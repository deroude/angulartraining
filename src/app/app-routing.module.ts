import { HomeComponent } from './components/home/home.component';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AuthService } from './services/auth.service';

const appRoutes: Routes = [
  { path: 'users', component: UserListComponent,canActivate:[AuthService],canLoad:[AuthService] },
  { path: 'articles', component: ArticleListComponent,canActivate:[AuthService],canLoad:[AuthService] },
  { path: '', component: HomeComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ]
})
export class AppRoutingModule { }