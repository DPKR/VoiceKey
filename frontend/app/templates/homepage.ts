import { Component } from '@angular/core';
import { AjaxUtil } from './ajaxUtil.service';
import './../../recorder.js';

@Component({
  selector: 'home-page',
  template: `
    <div class="container">
      <div class="row">
        <form class="col s12">
          <div class="row">
            <div class="input-field col s12">
              <input placeholder="Username" (keyup)="setUser($event)" type="text" class="validate">
            </div>
            <div class="input-field col s12">
              <input placeholder="Password" type="password" (keyup)="setPassword($event)" class="validate">
            </div>
          </div>
        </form>
        <div class="col s12">
          <a class="waves-effect waves-light btn" (click)="generateUser()">generate User Key </a>
          <a class="waves-effect waves-light btn" (click)="submitNewUser()">submit</a>
          <a class="waves-effect waves-light btn" (click)="test()">console.log</a>
          <a class="waves-effect waves-light btn" (click)="showUserKey()">show</a>

          <button onclick="startRecording(this);">record</button>
          <button onclick="stopRecording(this);" disabled>stop</button>
          <ul id="recordingslist"></ul>
        </div>
      </div>
    </div>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>

  `,
  providers: [AjaxUtil]
})
export class HomePage {
  private userKey : string;
  private profileList : Array<Object>;
  private token : string;
  private username : string;
  private password : string;

  constructor (private ajaxUtil : AjaxUtil) {}

  setUser(event: any) {
    this.username = event.target.value;
  }

  setPassword(event: any) {
    this.password = event.target.value;
  }

  generateUser() {
    this.ajaxUtil.createNewUser().subscribe(identificationProfileId => this.userKey = identificationProfileId);
  }

  submitNewUser() {
    console.log(this.userKey.identificationProfileId);
    console.log(this.username);
    console.log(this.password);
    this.ajaxUtil.saveNewUser(this.username, this.password, this.userKey.identificationProfileId).subscribe(token => this.token = token);
  }

  showUserKey() {
    this.ajaxUtil.getAllUser().subscribe(identificationProfileId => this.profileList = identificationProfileId);
  }

  registerUser() {
    this.ajaxUtil.registerUser(this.userKey).subscribe()
  }

  test() {
     console.log(this.userKey);
     console.log(this.profileList);
     console.log(this.token);
  }

}
