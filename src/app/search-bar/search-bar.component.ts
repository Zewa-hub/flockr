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
  authorMode :boolean = false;
  safeMode :boolean = true;
  tab_images :any[] = [];
  page_number:number = 0;
  page_position:number = 1;
  loading:boolean = true;
  error:boolean = false;
  errorMessage :string ="";

  constructor(private http : HttpClient, private service : FlickrService) { }
  ngOnInit(): void {
    this.getImagesHome(false,"")
  }
  changeBooleanValue(variable :any) : void {
    if (variable == "affichage")
      this.affichageMode = !this.affichageMode
    else if (variable == "author")
      this.authorMode = !this.authorMode
    else if (variable == "safe")
      this.safeMode = !this.safeMode
    else
      console.log("error")
  }
  regulatePagePosition(page:number):number{
    if (this.page_number == 0)
      return 1
    if(page > 0){
      if (page % this.page_number == 0)
        return this.page_number
      else 
        return page % this.page_number;
    }
    else 
      return this.page_number;
  }
  manageResult(data:any,err_message:string,err?:boolean):void{
    this.tab_images = data.photos.photo
    this.loading =false
    if (data.photos.total == 0 || err)
    {
      this.error =true
      this.errorMessage = err_message
    }
    if(data.photos.pages > 100)
      this.page_number = 100
    else
      this.page_number = data.photos.pages;
  }

  getImagesHome(err :boolean, err_message: string):void{
    this.loading =true
    this.error =false
    this.service.getAnyImages().subscribe(data => {
      this.manageResult(data,err_message,err)
      this.page_number = 0;
    })
  }
  getImages(page:number):void {
    this.loading =true
    this.error =false
    this.page_position = this.regulatePagePosition(page)
    var inputValue = (<HTMLInputElement>document.getElementById("search")).value;
    var dateMinValue = (<HTMLInputElement>document.getElementById("date_min")).value;
    var dateMaxValue = (<HTMLInputElement>document.getElementById("date_max")).value;
    var tagValue = (<HTMLInputElement>document.getElementById("tag")).value;
    var safeSearch = '1'
    if (!this.safeMode)
      safeSearch = '3'
    if (inputValue || tagValue)
    {
      if (!tagValue)
        this.service.getImagesBySearch(inputValue,dateMinValue,dateMaxValue,this.page_position,safeSearch).subscribe(data => {
          this.manageResult(data,"Aucunes images ne correspond à vos critères")
        })
      else
        this.service.getImagesBySearch(inputValue,dateMinValue,dateMaxValue,this.page_position,safeSearch,tagValue).subscribe(data => {
          this.manageResult(data,"Aucunes images ne correspond à vos critères")
        })
    }
    else
      this.getImagesHome(true,"Veuillez mettre plus de critères de recherches")
  }
getImagesOfAuthor(page:number): void{
  this.loading =true
  this.error =false
  this.page_position= this.regulatePagePosition(page)
  var authorsValue = (<HTMLInputElement>document.getElementById("author")).value;
  var safeSearch = '3'
    if (this.safeMode){
      safeSearch = '1'
    }
  if (!authorsValue)
    this.getImagesHome(true,"L'utilisateur n'a pas été trouvé ")
  else 
    this.service.getOwnerIdbyName(authorsValue).subscribe(data => {
      if (data.user)
      {
        this.service.getImagesOfPeople(data.user.id,this.service.images_per_page,this.page_position,safeSearch).subscribe(data => {
          this.manageResult(data,"L'utilisateur ne possède aucunes images")
      })
    }
    else 
      this.getImagesHome(true,"L'utilisateur n'a pas été trouvé")
  })
}

}
