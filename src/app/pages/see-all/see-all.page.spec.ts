import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeeAllPage } from './see-all.page';

describe('SeeAllPage', () => {
  let component: SeeAllPage;
  let fixture: ComponentFixture<SeeAllPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
