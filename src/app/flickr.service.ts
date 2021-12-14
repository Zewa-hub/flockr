import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface PhotosFlickr {
  photos: {
    photo:[{
      server: string,
      id: string,
      secret:string
    }];
  }
}

@Injectable({
  providedIn: 'root'
})

export class FlickrService {
  constructor(private http : HttpClient) { }
  getAnyImages() : Observable<PhotosFlickr>{
    return this.http.get<PhotosFlickr>("https://www.flickr.com/services/rest/",{
      params: {
        method: 'flickr.photos.getRecent',
        format: 'json',
        api_key: '10f83f31283d58084c74937adbb8b561',
        extras: 'tags,date_taken,owner_name,url_q,url_m',
        nojsoncallback: "?"
      }
    })
  }
  getImagesBySearch(search:string, parameter? : any) : Observable<PhotosFlickr>
  {
    return this.http.get<PhotosFlickr>("https://www.flickr.com/services/rest/",{
      params: {         
          text: search,
          method: 'flickr.photos.search',
          format: 'json',
          nojsoncallback: '?',
          tag_mode: 'all',
          media: 'photos',
          per_page: '15',
          extras: 'tags,date_taken,owner_name,url_q,url_m', 
          api_key: '10f83f31283d58084c74937adbb8b561'
      }
    })
    //.pipe(map((response : any) => response.photos.photo));
  }
}
