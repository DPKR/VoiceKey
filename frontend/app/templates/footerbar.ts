import { Component } from '@angular/core';

@Component({
  selector: 'footer-bar',
  template: `
    <footer class="page-footer" class="#7e57c2 deep-purple lighten-1">
      <div class="container">
        <div class="row">
          <div class="col l6 s12">
            <h5 class="white-text">Voice Authentication App</h5>
            <h5 class="white-text"> The future is now </h5>
            <p class="grey-text text-lighten-4">Daniel In. Daniel Son. Paul Kim</p>
          </div>
        </div>
      </div>
      <div class="footer-copyright white-text">
        <div class="container">
        © 2016 Copyright Whatever
        </div>
      </div>
    </footer>
  `
})
export class FooterBar {
}
