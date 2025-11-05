import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';
import { provideRouter } from '@angular/router';

describe('EmptyState', () => {
  let component: EmptyState;
  let fixture: ComponentFixture<EmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyState],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-icon')?.textContent).toContain('info');
  });

  it('should display custom icon', () => {
    component.icon = 'error_outline';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-icon')?.textContent).toContain(
      'error_outline'
    );
  });

  it('should display title when provided', () => {
    component.title = 'No encontrado';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('No encontrado');
  });

  it('should display message when provided', () => {
    component.message = 'No se encontró el contenido solicitado';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain(
      'No se encontró el contenido solicitado'
    );
  });

  it('should display action button when provided', () => {
    component.action = { label: 'Volver', route: '/home' };
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent).toContain('Volver');
  });

  it('should not display action button when not provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')).toBeNull();
  });
});
