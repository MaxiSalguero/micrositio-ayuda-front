import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeader } from './page-header';
import { provideRouter } from '@angular/router';

describe('PageHeader', () => {
  let component: PageHeader;
  let fixture: ComponentFixture<PageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeader],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show back button by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-back-button')).toBeTruthy();
  });

  it('should hide back button when showBackButton is false', () => {
    component.showBackButton = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-back-button')).toBeNull();
  });

  it('should display title when provided', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Test Title');
  });
});
