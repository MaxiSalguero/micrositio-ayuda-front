import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleCard } from './article-card';

describe('ArticleCard', () => {
  let component: ArticleCard;
  let fixture: ComponentFixture<ArticleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCard);
    component = fixture.componentInstance;
    component.title = 'Test Title'; // Required input
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card-title')?.textContent).toContain(
      'Test Title'
    );
  });

  it('should display excerpt when provided', () => {
    component.excerpt = 'This is a test excerpt';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.excerpt')?.textContent).toContain(
      'This is a test excerpt'
    );
  });

  it('should display category when provided', () => {
    component.category = 'Technology';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-chip')?.textContent).toContain(
      'Technology'
    );
  });

  it('should emit cardClick event when clicked', () => {
    spyOn(component.cardClick, 'emit');
    const card = fixture.nativeElement.querySelector('mat-card');
    card.click();
    expect(component.cardClick.emit).toHaveBeenCalled();
  });
});
