import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesPresentationComponent } from './images-presentation.component';

describe('ImagesPresentationComponent', () => {
  let component: ImagesPresentationComponent;
  let fixture: ComponentFixture<ImagesPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagesPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
