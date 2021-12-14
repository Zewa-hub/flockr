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
  constructor(private service:FlickrService) { }

  ngOnInit(): void {
  }

}
