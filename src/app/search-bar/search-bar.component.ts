import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { FlickrService } from '../flickr.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  affichage :boolean = true;
  tab_images :any[] = [];

  constructor(private http : HttpClient, private service : FlickrService) { }
  changeAffichage() :void
  {
    if (this.affichage)
    {
      this.affichage = false;
    }
    else{
      this.affichage =true;
    }
  }
  getImages():void {
    var inputValue = (<HTMLInputElement>document.getElementById("search")).value;
    if (inputValue === "")
    {
      this.service.getAnyImages().subscribe(data => {
        this.tab_images = data.photos.photo
      })
    }
    else
    {
      this.service.getImagesBySearch(inputValue).subscribe(data => {
        console.log(data)
        this.tab_images = data.photos.photo}
      )
    }
  }
  ngOnInit(): void {
    this.service.getAnyImages().subscribe(data => {
      this.tab_images = data.photos.photo
    })
  }
}
