import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingState } from './loading-state';

describe('LoadingState', () => {
  let component: LoadingState;
  let fixture: ComponentFixture<LoadingState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingState],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Cargando...');
  });

  it('should display custom message', () => {
    component.message = 'Cargando categorías...';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain(
      'Cargando categorías...'
    );
  });

  it('should use custom diameter', () => {
    component.diameter = 80;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner?.getAttribute('ng-reflect-diameter')).toBe('80');
  });
});
