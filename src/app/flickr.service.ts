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
export interface CommentsFlickr {
  comments: {
    photo_id:string,
    comment: [{
      authorname:string,
      _content: string
    }]
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
        extras: 'tags,date_taken,owner_name,url_q,url_m,o_dims,geo',
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
          accuracy : 16, 
          extras: 'tags,date_taken,owner_name,url_q,url_m,o_dims,geo', 
          api_key: '10f83f31283d58084c74937adbb8b561'
      }
    })
    //.pipe(map((response : any) => response.photos.photo));
  }
  getImagesOfPeople(user:string) : Observable<PhotosFlickr>{
    return this.http.get<PhotosFlickr>("https://www.flickr.com/services/rest/",{
      params: {
        method: 'flickr.people.getPhotos',
        format: 'json',
        user_id: user,
        per_page: '3',
        api_key: '10f83f31283d58084c74937adbb8b561',
        extras: 'tags,date_taken,owner_name,url_q,url_m,o_dims,geo',
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
