import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HomePage }           from './homepage';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class AjaxUtil {

  constructor (private http: Http) {}

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  saveNewUser(user: string, password : string, MId : string) : Observable<any> {
    let body = "userID=" + MId + "&username=" + user + "&password=" + password;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('http://localhost:8000/api/v1/user', body, options).map(this.extractData).catch(this.handleError);
  }

  login(user: string, password: string, MId : string) : Observable<any> {
    let body = "userID=" + MId + "&username=" + user + "&password=" + password;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers });
    return this.http.post('http://localhost:8000/api/v1/authenticate', body, options).map(this.extractData).catch(this.handleError);
  }

  // getCollection(user: string, password: string, MId: string, token: string ) : Observable<any> {
  //   let body = "userID=" + MId + "&username=" + user + "&password=" + password;
  //   let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'x-access-token' : token});
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http.get('http://localhost:8000/api/v1/user/collections', body, options).map(this.extractData).catch(this.handleError);
  // }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
