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
    HomePage.prototype.signupUser = function () {
        var _this = this;
        this.ajaxUtil.saveNewUser(this.username, this.password, this.username).subscribe(function (token) { return _this.token = token; }, function (error) { return _this.error = error; });
        if (!this.error) {
            this.signup = false;
        }
    };
    HomePage.prototype.login = function () {
        var _this = this;
        this.ajaxUtil.login(this.username, this.password, this.username).subscribe(function (token) { return _this.token = token; }, function (error) { return _this.error = error; });
        if (!this.error) {
            this.signup = false;
        }
    };
    HomePage.prototype.test = function () {
        console.log(this.token);
        console.log(this.error);
    };
    HomePage = __decorate([
        core_1.Component({
            selector: 'home-page',
            template: "\n    <div class=\"container\">\n      <div class=\"row\" *ngIf=\"signup\">\n        <form class=\"col s12\">\n          <div class=\"row\">\n            <h3> Sign up </h3>\n            <div class=\"input-field col s12\">\n              <input placeholder=\"Username\" (keyup)=\"setUser($event)\" type=\"text\" class=\"validate\">\n            </div>\n            <div class=\"input-field col s12\">\n              <input placeholder=\"Password\" type=\"password\" (keyup)=\"setPassword($event)\" class=\"validate\">\n            </div>\n          </div>\n        </form>\n        <div class=\"col s12\">\n          <a class=\"waves-effect waves-light btn\" (click)=\"signupUser()\">sign up</a>\n          <a class=\"waves-effect waves-light btn\" (click)=\"login()\">log in</a>\n        </div>\n      </div>\n      <div class=\"row\" *ngIf=\"!signup\">\n        <form class=\"col s12\">\n          <div class=\"row\">\n            <div class=\"col s12\">\n            <a href=\"#\" (click)=\"test()\"> test </a>\n              <ul>\n                <li> Success </li>\n              </ul>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n  ",
            providers: [ajaxUtil_service_1.AjaxUtil]
        }), 
        __metadata('design:paramtypes', [ajaxUtil_service_1.AjaxUtil])
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
//# sourceMappingURL=homepage.js.map