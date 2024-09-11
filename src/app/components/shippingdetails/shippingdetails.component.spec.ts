import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingdetailsComponent } from './shippingdetails.component';

describe('ShippingdetailsComponent', () => {
  let component: ShippingdetailsComponent;
  let fixture: ComponentFixture<ShippingdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShippingdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
