import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
//import xml2js from 'xml2js';  
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
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  request = "";
  tab_images :any[] = [];
  constructor(private http : HttpClient) { }

  getAnyImages() : Observable<PhotosFlickr>{
    return this.http.get<PhotosFlickr>("https://www.flickr.com/services/rest/",{
      params: {
        method: 'flickr.photos.getRecent',
        format: 'json',
        api_key: '10f83f31283d58084c74937adbb8b561',
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

  getImages():void {
    var inputValue = (<HTMLInputElement>document.getElementById("search")).value;
    if (inputValue === "")
    {
      this.getAnyImages().subscribe(data => {
        this.tab_images = data.photos.photo
      })
    }
    else
    {
      this.getImagesBySearch(inputValue).subscribe(data => {
        console.log(data)
        this.tab_images = data.photos.photo}
      )
    }
  }
  ngOnInit(): void {
    this.getAnyImages().subscribe(data => {
      this.tab_images = data.photos.photo
    })
  }
}
