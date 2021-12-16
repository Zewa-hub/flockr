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
  affichageMode :boolean = true;
  tab_images :any[] = [];
  authorMode :boolean = false;
  nomRecherche:string ="";
  page_number:number = 0;
  page_position:number = 1;
  loading:boolean = false;
  error:boolean = false;

  constructor(private http : HttpClient, private service : FlickrService) { }
  changeAffichageMode() :void
  {
    if (this.affichageMode)
      this.affichageMode = false;
    else
      this.affichageMode =true;
  }
  changeAuthorMode() :void
  {
    if (this.authorMode)
      this.authorMode= false;
    else
      this.authorMode =true;
  }
  regulatePagePosition(page:number):number{
    if (this.page_number == 0)
    {
      return 1
    }
    if(page > 0){
      if (page % this.page_number == 0)
        return this.page_number
      else 
        return page % this.page_number;
    }
    else 
      return this.page_number;
  }
  getImages(page:number):void {
    this.loading =true
    this.loading =false
    this.page_position = this.regulatePagePosition(page)
    var inputValue = (<HTMLInputElement>document.getElementById("search")).value;
    var dateMinValue = (<HTMLInputElement>document.getElementById("date_min")).value;
    var dateMaxValue = (<HTMLInputElement>document.getElementById("date_max")).value;
    var tagValue = (<HTMLInputElement>document.getElementById("tag")).value;
    if (inputValue || tagValue)
    {
      if (!tagValue)
      {
        this.service.getImagesBySearch(inputValue,dateMinValue,dateMaxValue,this.page_position).subscribe(data => {
          this.tab_images = data.photos.photo
          this.loading =false
          if(data.photos.pages > 100)
            this.page_number = 100
          else
            this.page_number = data.photos.pages;
            
        })
      }
      else
      {
        this.service.getImagesBySearch(inputValue,dateMinValue,dateMaxValue,page,tagValue).subscribe(data => {
      
          this.tab_images = data.photos.photo
          this.loading =false
          if(data.photos.pages > 100)
            this.page_number = 100
          else
            this.page_number = data.photos.pages;
        }
        )
      }
    }
    else
    {
      this.service.getAnyImages().subscribe(data => {
        console.log(data)
        this.tab_images = data.photos.photo
        this.page_number = 0;
        this.loading =false
      })
    }
  }
  ngOnInit(): void {
    this.loading =true
    this.service.getAnyImages().subscribe(data => {
      console.log(data)
      this.tab_images = data.photos.photo
      this.page_number = 0;
      this.loading =false
    })
  }
getImagesOfAuthor(page:number): void{
  this.loading =true
  this.error =false
  this.page_position= this.regulatePagePosition(page)
  var authorsValue = (<HTMLInputElement>document.getElementById("author")).value;
  if (!authorsValue){
    this.service.getAnyImages().subscribe(data => {
      this.tab_images = data.photos.photo
      this.loading =false
      this.page_number = 0;
    })
  }
  else {
    this.service.getOwnerIdbyName(authorsValue).subscribe(data => {
      console.log(data)
      this.loading =false
      if (data.user)
      {
        this.service.getImagesOfPeople(data.user.id,this.service.images_per_page,this.page_position).subscribe(data => {
          this.tab_images = data.photos.photo
          
          if(data.photos.pages > 10)
            this.page_number = 100
          else
            this.page_number = data.photos.pages;
      })
    }
    else {
      this.service.getAnyImages().subscribe(data => {
        this.tab_images = data.photos.photo
        this.page_number = 0;
        this.error = true;
      })
    }
  })
  }
}
}
