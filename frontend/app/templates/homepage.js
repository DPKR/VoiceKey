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
    }
    HomePage.prototype.getNewUserKey = function () {
        if (!this.userKey) {
        }
        else {
        }
    };
    HomePage.prototype.showUserKey = function () {
        var _this = this;
        this.ajaxUtil.getAllUser().subscribe(function (identificationProfileId) { return _this.profileList = identificationProfileId; });
    };
    HomePage.prototype.registerUser = function () {
        this.ajaxUtil.registerUser(this.userKey).subscribe();
    };
    HomePage.prototype.test = function () {
        console.log(this.profileList);
    };
    HomePage = __decorate([
        core_1.Component({
            selector: 'home-page',
            template: "\n    <div class=\"container #7e57c2 deep-purple lighten-1\">\n      <button type=\"button\" (click)=\"test()\">Test</button>\n      <button type=\"button\" (click)=\"showUserKey()\"> show</button>\n      <button onclick=\"startRecording(this);\">record</button>\n      <button (click)=\"getNewUserKey()\" onclick=\"stopRecording(this);\" disabled>stop</button>\n      <ul id=\"recordingslist\"></ul>\n    </div>\n  ",
            providers: [ajaxUtil_service_1.AjaxUtil]
        }), 
        __metadata('design:paramtypes', [ajaxUtil_service_1.AjaxUtil])
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
//# sourceMappingURL=homepage.js.map