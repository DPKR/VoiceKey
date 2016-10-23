import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { HttpModule } from '@angular/http';
import { HomePage } from './templates/homepage';
import { NavBar } from './templates/navbar';

@NgModule({
  imports:      [ 
  	BrowserModule,
  	HttpModule
  ],
  declarations: [ 
  	AppComponent,
  	HomePage,
  	NavBar
	 ],
  bootstrap:    [ AppComponent ],
  entryComponents: [
  	
  ],
  providers: []
})
export class AppModule { }
