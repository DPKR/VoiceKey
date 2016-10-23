import { Component } from '@angular/core';

@Component({
  selector: 'nav-bar',
  template: `
  <nav class="#7e57c2 deep-purple lighten-1" style="margin-bottom: 1em">
    <div class="nav-wrapper">
      <a href="#" class="brand-logo" style="padding-left: 1em">V-Auth</a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><a href="#">Home</a></li>
      </ul>
    </div>
  </nav>
  `
})
export class NavBar {
}
