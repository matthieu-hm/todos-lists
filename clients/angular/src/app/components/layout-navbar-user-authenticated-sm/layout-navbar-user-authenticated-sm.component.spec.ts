import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutNavbarUserAuthenticatedSmComponent } from './layout-navbar-user-authenticated-sm.component';

describe('LayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LayoutNavbarUserAuthenticatedSmComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(LayoutNavbarUserAuthenticatedSmComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
