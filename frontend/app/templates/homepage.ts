import { Component } from '@angular/core';
import { AjaxUtil } from './ajaxUtil.service';
import './../../recorder.js';

@Component({
  selector: 'home-page',
  template: `
    <div class="container #7e57c2 deep-purple lighten-1">
      <button type="button" (click)="test()">Test</button>
      <button type="button" (click)="showUserKey()"> show</button>
      <button onclick="startRecording(this);">record</button>
      <button (click)="getNewUserKey()" onclick="stopRecording(this);" disabled>stop</button>
      <ul id="recordingslist"></ul>
    </div>
  `,
  providers: [AjaxUtil]
})
export class HomePage {
  private userKey : string;
  private profileList : Array<Object>;
  constructor (private ajaxUtil : AjaxUtil) {}

  getNewUserKey() {
    if(!this.userKey) {
      //this.ajaxUtil.getNewUser().subscribe(identificationProfileId => this.userKey = identificationProfileId);
    } else {
      //do nothing
    }
    
  }

  showUserKey() {
    this.ajaxUtil.getAllUser().subscribe(identificationProfileId => this.profileList = identificationProfileId);
  }

  registerUser() {
    this.ajaxUtil.registerUser(this.userKey).subscribe()
  }

  test() {
    console.log(this.profileList);
  }

}
