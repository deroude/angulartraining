import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { environment } from './../../environments/environment';
import { Resource } from '../domain/resource';

@Injectable()
export class RestService {

  constructor(private _http: HttpClient, private _auth: AuthService) { }

  public getList<T>(path: string, query?: { [key: string]: any }, authenticate: boolean = true): Observable<Resource<T>> {
    let params: HttpParams = new HttpParams();
    for (var k in query) {
      params = params.append(k, "" + query[k]);
    }
    if (authenticate) {
      return this._auth.checkCredentials().switchMap(tk => {
        if (tk !== null) {
          let headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + tk)
          return this._http.get<Resource<T>>(environment.rootPath + path, { params: params, headers: headers });
        }
      });
    } else {
      return this._http.get<Resource<T>>(environment.rootPath + path, { params: params });
    }
  }

  public getOne<T>(path: string, authenticate: boolean = true): Observable<T> {
    if (authenticate) {
      return this._auth.checkCredentials().switchMap(tk => {
        if (tk !== null) {
          let headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + tk)
          return this._http.get<T>(environment.rootPath + path, { headers: headers });
        }
      });
    } else {
      return this._http.get<T>(environment.rootPath + path, {});
    }
  }

  public delete(path: string, authenticate: boolean = true): Observable<boolean> {
    if (authenticate) {
      return this._auth.checkCredentials().switchMap(tk => {
        if (tk !== null) {
          let headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + tk)
          return this._http.delete(environment.rootPath + path, { headers: headers }).map(a => true).catch(e => Observable.of(false));
        }
      });
    } else {
      return this._http.delete(environment.rootPath + path).map(a => true).catch(e => Observable.of(false));
    }
  }

  public update<T>(path: string, entity: T, authenticate: boolean = true): Observable<T> {
    if (authenticate) {
      return this._auth.checkCredentials().switchMap(tk => {
        if (tk !== null) {
          let headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + tk)
          return this._http.put<T>(environment.rootPath + path, entity, { headers: headers });
        }
      });
    } else {
      return this._http.put<T>(environment.rootPath + path, entity);
    }
  }

  public create<T>(path: string, entity: T, authenticate: boolean = true): Observable<T> {
    if (authenticate) {
      return this._auth.checkCredentials().switchMap(tk => {
        if (tk !== null) {
          let headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + tk)
          return this._http.post<T>(environment.rootPath + path, entity, { headers: headers });
        }
      });
    } else {
      return this._http.post<T>(environment.rootPath + path, entity);
    }
  }

}
