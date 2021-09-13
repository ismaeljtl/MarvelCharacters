import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Md5} from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  url = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getCharacters(offset: number): any{
    return this.http.get(
      this.url + `/v1/public/characters`, {
        params: new HttpParams().set('limit', 30).set('offset', offset)
      }
    ).toPromise();
  }

  getCharacter(id: number): any{
    return this.http.get(
      this.url + `/v1/public/characters/${id}`
    ).toPromise();
  }

}
