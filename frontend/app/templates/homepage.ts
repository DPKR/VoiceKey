import { Component } from '@angular/core';
import { AjaxUtil } from './ajaxUtil.service';

@Component({
  selector: 'home-page',
  template: `
    <div class="container">
      <div class="row" *ngIf="signup">
        <form class="col s12">
          <div class="row">
            <h3> Sign up </h3>
            <div class="input-field col s12">
              <input placeholder="Username" (keyup)="setUser($event)" type="text" class="validate">
            </div>
            <div class="input-field col s12">
              <input placeholder="Password" type="password" (keyup)="setPassword($event)" class="validate">
            </div>
          </div>
        </form>
        <div class="col s12">
          <a class="waves-effect waves-light btn" (click)="signupUser()">sign up</a>
          <a class="waves-effect waves-light btn" (click)="login()">log in</a>
        </div>
      </div>
      <div class="row" *ngIf="!signup">
        <form class="col s12">
          <div class="row">
            <div class="col s12">
            <a href="#" (click)="test()"> test </a>
              <ul>
                <li> Success </li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  providers: [AjaxUtil]
})
export class HomePage {
  private token : string; //cache
  private username : string;
  private password : string;
  private signup : boolean;
  private error : string;

  constructor (private ajaxUtil : AjaxUtil) {
    this.signup = true;
  }

  onChange(event: any) {
    console.log(event.target.value);
  }

  setUser(event: any) {
    this.username = event.target.value;
  }

  setPassword(event: any) {
    this.password = event.target.value;
  }

  signupUser() {
    this.ajaxUtil.saveNewUser(this.username, this.password, this.username).subscribe(token => this.token = token, error => this.error = error);
    if(!this.error) {
      this.signup = false;
    }
  }

  login() {
    this.ajaxUtil.login(this.username, this.password, this.username).subscribe(token => this.token = token, error => this.error = error);
    if(!this.error) {
      this.signup = false;
    }
  }

  test() {
    console.log(this.token);
    console.log(this.error);
  }
}

