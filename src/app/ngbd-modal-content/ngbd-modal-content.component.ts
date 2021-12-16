import {Component, Input, OnInit} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FlickrService } from '../flickr.service';


@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './ngbd-modal-content.component.html',
  styleUrls: ['./ngbd-modal-content.component.css']
})
export class NgbdModalContentComponent implements OnInit {
  @Input() image :any ;
  author_images :any[] = []
  list_comments : any[] = []
  IsAnyComments: boolean = false
  constructor(public activeModal: NgbActiveModal,private service:FlickrService) {}
  ngOnInit(): void {
    this.service.getImagesOfPeople(this.image.owner,5,1,3).subscribe(data => {
      this.author_images = data.photos.photo
    })
    this.service.getCommentOfPhoto(this.image.id).subscribe(data => {
      this.list_comments = data.comments.comment
      for (let i of data.comments.comment)
      {
        i._content = i._content.replace(/<[^>]*>/g, '');
      }
      if (data.comments.comment)
      {
        this.IsAnyComments = true
      }
    })
    
  }
  
}

