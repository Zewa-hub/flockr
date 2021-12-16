import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface PhotosFlickr {
  photos: {
    pages :number,
    total :number,
    photo:[{
      server: string,
      id: string,
      secret:string
    }];
  }
}
export interface CommentsFlickr {
  comments: {
    photo_id:string,
    comment: [{
      authorname:string,
      _content: string
    }]
  }
}
export interface PeopleFlickr {
  user: {
    id :string;
  }
}
@Injectable({
  providedIn: 'root'
})

export class FlickrService {
  constructor(private http : HttpClient) { }
  images_per_page:number = 40;
  api_key:string = "10f83f31283d58084c74937adbb8b561"
  format:string = "json"
  extras:string ='tags,date_taken,owner_name,url_q,url_m,o_dims,geo'
  getAnyImages() : Observable<PhotosFlickr>{
    return this.http.get<PhotosFlickr>("https://www.flickr.com/services/rest/",{
      params: {         
        text: "",
        method: 'flickr.photos.search',
        format: this.format,
        nojsoncallback: '?',
        tag_mode: 'all',
        media: 'photos',
        per_page: 8,
        safe_search: '1',
        accuracy : 16, 
        extras: this.extras, 
        api_key: this.api_key
    }
  })
  }
  getImagesBySearch(search:string, date_min:string ,date_max: string,page :number,safeSearch:any,tag?:string) : Observable<PhotosFlickr>
  {
    return this.http.get<PhotosFlickr>("https://www.flickr.com/services/rest/",{
      params: {         
          text: search,
          method: 'flickr.photos.search',
          format: this.format,
          nojsoncallback: '?',
          tag_mode: 'all',
          safe_search: safeSearch,
          tags: tag ?? search,
          min_upload_date: date_min,
          max_upload_date: date_max,
          media: 'photos',
          per_page: this.images_per_page,
          page: page,
          accuracy : '16', 
          extras: this.extras, 
          api_key: this.api_key
      }
    })
  }
  getImagesOfPeople(user:string, page_size:number,page:number,safeSearch:any) : Observable<PhotosFlickr>{
    return this.http.get<PhotosFlickr>("https://www.flickr.com/services/rest/",{
      params: {
        method: 'flickr.people.getPhotos',
        format: this.format,
        user_id: user,
        safe_search: safeSearch,
        per_page: page_size,
        page: page,
        api_key: this.api_key,
        extras: this.extras,
        nojsoncallback: "?"
      }
    })
  }
  getOwnerIdbyName(user:string): Observable<PeopleFlickr>
  {
    return this.http.get<PeopleFlickr>("https://www.flickr.com/services/rest/",{
      params: {
        method: 'flickr.people.findByUsername',
        format: this.format,
        username: user,
        api_key: this.api_key,
        nojsoncallback: "?"
      }
    })
  }
  getCommentOfPhoto(id_photo:string) : Observable<CommentsFlickr>{
    return this.http.get<CommentsFlickr>("https://www.flickr.com/services/rest/",{
      params: {
        method: 'flickr.photos.comments.getList',
        format: this.format,
        photo_id: id_photo,
        api_key: this.api_key,
        nojsoncallback: "?"
      }
    })
  }

}
