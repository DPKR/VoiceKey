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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var AjaxUtil = (function () {
    function AjaxUtil(http) {
        this.http = http;
    }
    AjaxUtil.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    AjaxUtil.prototype.getNewUser = function () {
        var body = {
            "locale": "en-us",
        };
        var headers = new http_1.Headers({ 'Ocp-Apim-Subscription-Key': '0453bf1784da47beae7889ee3b5d5760' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('https://api.projectoxford.ai/spid/v1.0/identificationProfiles', body, options).map(this.extractData).catch(this.handleError);
    };
    AjaxUtil.prototype.getAllUser = function () {
        var headers = new http_1.Headers({ 'Ocp-Apim-Subscription-Key': '0453bf1784da47beae7889ee3b5d5760' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get('https://api.projectoxford.ai/spid/v1.0/verificationProfiles', options).map(this.extractData).catch(this.handleError);
    };
    AjaxUtil.prototype.registerUser = function (key) {
        var body = "verificationProfileId=" + key;
        var headers = new http_1.Headers({ 'Ocp-Apim-Subscription-Key': '0453bf1784da47beae7889ee3b5d5760' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('https://api.projectoxford.ai/spid/v1.0/verificationProfiles/{verificationProfileId}/enroll', body, options).map(this.extractData).catch(this.handleError);
    };
    AjaxUtil.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    AjaxUtil = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AjaxUtil);
    return AjaxUtil;
}());
exports.AjaxUtil = AjaxUtil;
//# sourceMappingURL=ajaxUtil.service.js.map