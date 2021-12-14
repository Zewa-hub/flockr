import { Component, Input, OnInit } from '@angular/core';
import { FlickrService } from '../flickr.service';

@Component({
  selector: 'images-presentation',
  templateUrl: './images-presentation.component.html',
  styleUrls: ['./images-presentation.component.css']
})
export class ImagesPresentationComponent implements OnInit {
  @Input () message :boolean=false;
  @Input() list_images:any[] = [];
  position :number = 0
  constructor(private service:FlickrService) { }

  ngOnChanges(changes: any) {
    /** Fire any time employee changes */
    if (changes.message || changes.list_images) {
      this.position =0
    }
  }
  
  AddingOne(){
    this.position = this.position + 1  
    this.position = this.position % this.list_images.length;
  
  }
  RemovingOne()
  {
    this.position = this.position -1;
    if (this.position == -1 ){
      this.position = this.list_images.length - 1;
    }
  }
  ngOnInit(): void {
  }

}
