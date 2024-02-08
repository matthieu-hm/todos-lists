import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutNavbarUserAuthenticatedComponent } from './layout-navbar-user-authenticated.component';

describe('LayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LayoutNavbarUserAuthenticatedComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(LayoutNavbarUserAuthenticatedComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
