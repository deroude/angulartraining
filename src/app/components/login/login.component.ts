import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../domain/user';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private user: User = new User();

  constructor(private authSvc: AuthService, private rest: RestService) { }

  ngOnInit() {
    this.authSvc.authenticated.subscribe(y => {
      if (y) {
        this.rest.getOne<User>("api/user/me", true).subscribe(u => this.user = u)
      }
    });
  }

  login(): void {
    this.authSvc.login(this.user.username, this.user.password)
      .subscribe(token => this.rest.getOne<User>("api/user/me", true)
        .subscribe(u => this.user = u));
  }

  logout(): void {
    this.user=new User();
    this.authSvc.logout();
  }

}
