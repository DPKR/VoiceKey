import { Component } from '@angular/core';
import { AjaxUtil } from './ajaxUtil.service';
import './../../recorder.js';

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
          <a class="waves-effect waves-light btn" (click)="generateUser()">generate User Key </a>
          <a class="waves-effect waves-light btn" (click)="submitNewUser()">submit</a>
          <a class="waves-effect waves-light btn" (click)="test()">console.log</a>
        </div>
      </div>
      <div class="row" *ngIf="!signup">
        <form class="col s12">
          <div class="row">
            <h3 class="col s12">Training </h3>
            <div class="col s6">
              <h4> Please record 3 audio files </h4>
              <h5> The Phrase you must say: </h5>
              <p> my password is not your business </p>
              <button onclick="startRecording(this);">record</button>
              <button onclick="stopRecording(this);" disabled>stop</button>
              <ul id="recordingslist"></ul>
            </div>
            <div class="col s6">
              <h4> Please add the 3 audio files (WAV format)</h4>
              <input type="file" (change)="onChange($event)">
              <input type="file" (change)="onChange($event)">
              <input type="file" (change)="onChange($event)">
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  providers: [AjaxUtil]
})
export class HomePage {
  private userKey : any;
  private profileList : Array<Object>;
  private token : string;
  private username : string;
  private password : string;
  private signup : boolean;
  private wavFiles : Array<any>;

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

  generateUser() {
    this.ajaxUtil.createNewUser().subscribe(identificationProfileId => this.userKey = identificationProfileId);
  }

  submitNewUser() {
    this.ajaxUtil.saveNewUser(this.username, this.password, this.userKey.identificationProfileId).subscribe(token => this.token = token);
    this.signup = false;
  }

  registerUser() {
    this.ajaxUtil.registerUser(this.userKey).subscribe()
  }

  test() {
    console.log(this.userKey);
    console.log(this.profileList);
    console.log(this.token);
    this.signup = false;
  }

}
