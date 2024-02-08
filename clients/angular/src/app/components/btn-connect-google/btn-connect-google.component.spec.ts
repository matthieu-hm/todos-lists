import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BtnConnectGoogleComponent } from './btn-connect-google.component';

describe('LayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BtnConnectGoogleComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(BtnConnectGoogleComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
