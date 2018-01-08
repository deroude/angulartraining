import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../domain/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private user: User = new User();

  constructor(private authSvc: AuthService) { }

  ngOnInit() {
  }

  login(): void {    
    this.authSvc.login(this.user.username, this.user.password).subscribe(token=>console.log(token));
  }

  logout(): void {
    this.authSvc.logout();
  }

}
