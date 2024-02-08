import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutNavbarUserUnauthenticatedComponent } from './layout-navbar-user-unauthenticated.component';

describe('LayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LayoutNavbarUserUnauthenticatedComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(LayoutNavbarUserUnauthenticatedComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
