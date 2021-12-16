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
  getAnyImages() : Observable<PhotosFlickr>{
    return this.http.get<PhotosFlickr>("https://www.flickr.com/services/rest/",{
      params: {         
        text: "",
        method: 'flickr.photos.search',
        format: 'json',
        nojsoncallback: '?',
        tag_mode: 'all',
        media: 'photos',
        per_page: this.images_per_page,
        safe_search: '1',
        accuracy : 16, 
        extras: 'tags,date_taken,owner_name,url_q,url_m,o_dims,geo', 
        api_key: '10f83f31283d58084c74937adbb8b561'
    }
  })
  }
  getImagesBySearch(search:string, date_min:string ,date_max: string,page :number,tag?:string) : Observable<PhotosFlickr>
  {
    return this.http.get<PhotosFlickr>("https://www.flickr.com/services/rest/",{
      params: {         
          text: search,
          method: 'flickr.photos.search',
          format: 'json',
          nojsoncallback: '?',
          tag_mode: 'all',
          tags: tag ?? search,
          min_upload_date: date_min,
          max_upload_date: date_max,
          media: 'photos',
          per_page: this.images_per_page,
          page: page,
          accuracy : 16, 
          extras: 'tags,date_taken,owner_name,url_q,url_m,o_dims,geo', 
          api_key: '10f83f31283d58084c74937adbb8b561'
      }
    })
  }
  getImagesOfPeople(user:string, page_size:number,page:number) : Observable<PhotosFlickr>{
    return this.http.get<PhotosFlickr>("https://www.flickr.com/services/rest/",{
      params: {
        method: 'flickr.people.getPhotos',
        format: 'json',
        user_id: user,
        per_page: page_size,
        page: page,
        api_key: '10f83f31283d58084c74937adbb8b561',
        extras: 'tags,date_taken,owner_name,url_q,url_m,o_dims,geo',
        nojsoncallback: "?"
      }
    })
  }
  getOwnerIdbyName(user:string): Observable<PeopleFlickr>
  {
    return this.http.get<PeopleFlickr>("https://www.flickr.com/services/rest/",{
      params: {
        method: 'flickr.people.findByUsername',
        format: 'json',
        username: user,
        api_key: '10f83f31283d58084c74937adbb8b561',
        nojsoncallback: "?"
      }
    })
  }
  getCommentOfPhoto(id_photo:string) : Observable<CommentsFlickr>{
    return this.http.get<CommentsFlickr>("https://www.flickr.com/services/rest/",{
      params: {
        method: 'flickr.photos.comments.getList',
        format: 'json',
        photo_id: id_photo,
        api_key: '10f83f31283d58084c74937adbb8b561',
        nojsoncallback: "?"
      }
    })
  }

}
