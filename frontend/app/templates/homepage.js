"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ajaxUtil_service_1 = require('./ajaxUtil.service');
require('./../../recorder.js');
var HomePage = (function () {
    function HomePage(ajaxUtil) {
        this.ajaxUtil = ajaxUtil;
        this.signup = true;
    }
    HomePage.prototype.onChange = function (event) {
        console.log(event.target.value);
    };
    HomePage.prototype.setUser = function (event) {
        this.username = event.target.value;
    };
    HomePage.prototype.setPassword = function (event) {
        this.password = event.target.value;
    };
    HomePage.prototype.generateUser = function () {
        var _this = this;
        this.ajaxUtil.createNewUser().subscribe(function (identificationProfileId) { return _this.userKey = identificationProfileId; });
    };
    HomePage.prototype.submitNewUser = function () {
        var _this = this;
        this.ajaxUtil.saveNewUser(this.username, this.password, this.userKey.identificationProfileId).subscribe(function (token) { return _this.token = token; });
        this.signup = false;
    };
    HomePage.prototype.registerUser = function () {
        this.ajaxUtil.registerUser(this.userKey).subscribe();
    };
    HomePage.prototype.test = function () {
        console.log(this.userKey);
        console.log(this.profileList);
        console.log(this.token);
        this.signup = false;
    };
    HomePage = __decorate([
        core_1.Component({
            selector: 'home-page',
            template: "\n    <div class=\"container\">\n      <div class=\"row\" *ngIf=\"signup\">\n        <form class=\"col s12\">\n          <div class=\"row\">\n            <h3> Sign up </h3>\n            <div class=\"input-field col s12\">\n              <input placeholder=\"Username\" (keyup)=\"setUser($event)\" type=\"text\" class=\"validate\">\n            </div>\n            <div class=\"input-field col s12\">\n              <input placeholder=\"Password\" type=\"password\" (keyup)=\"setPassword($event)\" class=\"validate\">\n            </div>\n          </div>\n        </form>\n        <div class=\"col s12\">\n          <a class=\"waves-effect waves-light btn\" (click)=\"generateUser()\">generate User Key </a>\n          <a class=\"waves-effect waves-light btn\" (click)=\"submitNewUser()\">submit</a>\n          <a class=\"waves-effect waves-light btn\" (click)=\"test()\">console.log</a>\n        </div>\n      </div>\n      <div class=\"row\" *ngIf=\"!signup\">\n        <form class=\"col s12\">\n          <div class=\"row\">\n            <h3 class=\"col s12\">Training </h3>\n            <div class=\"col s6\">\n              <h4> Please record 3 audio files </h4>\n              <h5> The Phrase you must say: </h5>\n              <p> my password is not your business </p>\n              <button onclick=\"startRecording(this);\">record</button>\n              <button onclick=\"stopRecording(this);\" disabled>stop</button>\n              <ul id=\"recordingslist\"></ul>\n            </div>\n            <div class=\"col s6\">\n              <h4> Please add the 3 audio files (WAV format)</h4>\n              <input type=\"file\" (change)=\"onChange($event)\">\n              <input type=\"file\" (change)=\"onChange($event)\">\n              <input type=\"file\" (change)=\"onChange($event)\">\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n  ",
            providers: [ajaxUtil_service_1.AjaxUtil]
        }), 
        __metadata('design:paramtypes', [ajaxUtil_service_1.AjaxUtil])
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
//# sourceMappingURL=homepage.js.map