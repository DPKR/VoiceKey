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
var FooterBar = (function () {
    function FooterBar() {
    }
    FooterBar = __decorate([
        core_1.Component({
            selector: 'footer-bar',
            template: "\n    <footer class=\"page-footer\" class=\"#7e57c2 deep-purple lighten-1\">\n      <div class=\"container\">\n        <div class=\"row\">\n          <div class=\"col l6 s12\">\n            <h5 class=\"white-text\">Voice Authentication App</h5>\n            <p class=\"grey-text text-lighten-4\">Daniel In. Daniel Son. Paul Kim</p>\n          </div>\n        </div>\n      </div>\n      <div class=\"footer-copyright white-text\">\n        <div class=\"container\">\n        \u00A9 2016 Copyright Whatever\n        </div>\n      </div>\n    </footer>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], FooterBar);
    return FooterBar;
}());
exports.FooterBar = FooterBar;
//# sourceMappingURL=footerbar.js.map