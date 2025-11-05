import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService, SeoConfig } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let metaService: jasmine.SpyObj<Meta>;
  let titleService: jasmine.SpyObj<Title>;

  beforeEach(() => {
    const metaSpy = jasmine.createSpyObj('Meta', ['updateTag']);
    const titleSpy = jasmine.createSpyObj('Title', ['setTitle']);

    TestBed.configureTestingModule({
      providers: [
        SeoService,
        { provide: Meta, useValue: metaSpy },
        { provide: Title, useValue: titleSpy },
      ],
    });

    service = TestBed.inject(SeoService);
    metaService = TestBed.inject(Meta) as jasmine.SpyObj<Meta>;
    titleService = TestBed.inject(Title) as jasmine.SpyObj<Title>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateMetaTags', () => {
    it('should update title', () => {
      const config: SeoConfig = {
        title: 'Test Page',
        description: 'Test description',
      };

      service.updateMetaTags(config);

      expect(titleService.setTitle).toHaveBeenCalledWith('Test Page');
    });

    it('should update basic meta tags', () => {
      const config: SeoConfig = {
        title: 'Test Page',
        description: 'Test description',
      };

      service.updateMetaTags(config);

      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Test description',
      });
    });

    it('should update Open Graph tags', () => {
      const config: SeoConfig = {
        title: 'Test Page',
        description: 'Test description',
        url: 'https://example.com/test',
        type: 'article',
      };

      service.updateMetaTags(config);

      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:title',
        content: 'Test Page',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:description',
        content: 'Test description',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:type',
        content: 'article',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        property: 'og:url',
        content: 'https://example.com/test',
      });
    });

    it('should update Twitter Card tags', () => {
      const config: SeoConfig = {
        title: 'Test Page',
        description: 'Test description',
      };

      service.updateMetaTags(config);

      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'twitter:card',
        content: 'summary',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'twitter:title',
        content: 'Test Page',
      });
      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'twitter:description',
        content: 'Test description',
      });
    });

    it('should use summary_large_image for articles', () => {
      const config: SeoConfig = {
        title: 'Article',
        description: 'Article description',
        type: 'article',
      };

      service.updateMetaTags(config);

      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'twitter:card',
        content: 'summary_large_image',
      });
    });

    it('should use default image if not provided', () => {
      const config: SeoConfig = {
        title: 'Test',
        description: 'Test',
      };

      service.updateMetaTags(config);

      expect(metaService.updateTag).toHaveBeenCalledWith(
        jasmine.objectContaining({
          property: 'og:image',
        })
      );
    });

    it('should update keywords if provided', () => {
      const config: SeoConfig = {
        title: 'Test',
        description: 'Test',
        keywords: ['angular', 'seo', 'testing'],
      };

      service.updateMetaTags(config);

      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'keywords',
        content: 'angular, seo, testing',
      });
    });
  });

  describe('updateTitle', () => {
    it('should update only the title', () => {
      service.updateTitle('New Title');

      expect(titleService.setTitle).toHaveBeenCalledWith('New Title');
    });
  });

  describe('updateDescription', () => {
    it('should update only the description', () => {
      service.updateDescription('New description');

      expect(metaService.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'New description',
      });
    });
  });

  describe('generateDescription', () => {
    it('should return content as is if shorter than maxLength', () => {
      const content = 'Short content';
      const result = service.generateDescription(content, 50);

      expect(result).toBe('Short content');
    });

    it('should truncate content if longer than maxLength', () => {
      const content = 'This is a very long content that should be truncated to fit the maximum length allowed for SEO descriptions.';
      const result = service.generateDescription(content, 50);

      expect(result).toBe('This is a very long content that should be trun...');
      expect(result.length).toBeLessThanOrEqual(53); // 50 + "..."
    });

    it('should use 160 as default maxLength', () => {
      const content = 'A'.repeat(200);
      const result = service.generateDescription(content);

      expect(result.length).toBe(163); // 160 + "..."
    });

    it('should normalize whitespace', () => {
      const content = 'Content   with    multiple     spaces';
      const result = service.generateDescription(content);

      expect(result).toBe('Content with multiple spaces');
    });
  });
});
