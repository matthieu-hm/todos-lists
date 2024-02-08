import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutNavbarUserUnauthenticatedSmComponent } from './layout-navbar-user-unauthenticated-sm.component';

describe('LayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LayoutNavbarUserUnauthenticatedSmComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(LayoutNavbarUserUnauthenticatedSmComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
