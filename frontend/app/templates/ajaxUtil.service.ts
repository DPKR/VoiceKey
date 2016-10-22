import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HomePage }           from './homepage';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class AjaxUtil {

  private heroesUrl = 'app/heroes';  // URL to web API
  constructor (private http: Http) {}
  getHeroes (): Observable<HomePage[]> {
    return this.http.get(this.heroesUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  getNewUser(): Observable<any> {
    let body = {
      "locale":"en-us",
    };
    let headers = new Headers({ 'Ocp-Apim-Subscription-Key': '0453bf1784da47beae7889ee3b5d5760' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('https://api.projectoxford.ai/spid/v1.0/identificationProfiles',body, options).map(this.extractData).catch(this.handleError);
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
