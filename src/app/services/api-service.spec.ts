import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api-service';
import { environment } from '../../environments/environment';
import { Category, IPost, IRelated, ITaxonomy, Like } from '../shared';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTitle', () => {
    it('should get title as text', () => {
      const mockTitle = 'Ayuda de Redif';

      service.getTitle().subscribe(title => {
        expect(title).toBe(mockTitle);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('text');
      req.flush(mockTitle);
    });
  });

  describe('getCategories', () => {
    it('should get all categories', () => {
      const mockCategories: Category[] = [
        { id: 1, title: 'Categoría 1', info: null, content: null, slug: 'categoria-1', post: [] },
        { id: 2, title: 'Categoría 2', info: null, content: null, slug: 'categoria-2', post: [] },
      ];

      service.getCategories().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
        expect(categories.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });
  });

  describe('getCategoryByTitle', () => {
    it('should get category by title', () => {
      const mockCategory: Category = {
        id: 1,
        title: 'Alumnos',
        info: null,
        content: null,
        slug: 'alumnos',
        post: [],
      };

      service.getCategoryByTitle('Alumnos').subscribe(category => {
        expect(category).toEqual(mockCategory);
        expect(category.title).toBe('Alumnos');
      });

      const req = httpMock.expectOne(`${baseUrl}/categories/category/Alumnos`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategory);
    });
  });

  describe('getCategoryById', () => {
    it('should get category by id with posts', () => {
      const mockCategory: Category = {
        id: 1,
        title: 'Test Category',
        info: null,
        content: null,
        slug: 'test-category',
        post: [
          {
            id: 1,
            title: 'Post 1',
            content: 'Content 1',
            status: 'published',
            slug: 'post-1',
            views: 0,
            created: new Date(),
            updated: new Date(),
            likes: [],
          },
        ],
      };

      service.getCategoryById(1).subscribe(category => {
        expect(category).toEqual(mockCategory);
        expect(category.post.length).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/categories/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategory);
    });
  });

  describe('getPostById', () => {
    it('should get post by id', () => {
      const mockPost: IPost = {
        id: 1,
        title: 'Test Post',
        content: '# Test content',
        status: 'published',
        slug: 'test-post',
        views: 100,
        created: new Date(),
        updated: new Date(),
        likes: [],
        category: [],
      };

      service.getPostById(1).subscribe(post => {
        expect(post).toEqual(mockPost);
        expect(post.title).toBe('Test Post');
      });

      const req = httpMock.expectOne(`${baseUrl}/posts/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPost);
    });
  });

  describe('getRelated', () => {
    it('should get related posts', () => {
      const mockRelated: IRelated[] = [
        {
          id: 1,
          post: {
            id: 1,
            title: 'Post 1',
            content: 'Content 1',
            status: 'published',
            slug: 'post-1',
            views: 10,
            created: new Date(),
            updated: new Date(),
            likes: [],
          },
          related: {
            id: 2,
            title: 'Related Post',
            content: 'Related content',
            status: 'published',
            slug: 'related-post',
            views: 5,
            created: new Date(),
            updated: new Date(),
            likes: [],
          },
        },
      ];

      service.getRelated().subscribe(related => {
        expect(related).toEqual(mockRelated);
        expect(related.length).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/related`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRelated);
    });
  });

  describe('getTaxonomy', () => {
    it('should get taxonomy relationships', () => {
      const mockTaxonomy: ITaxonomy[] = [
        {
          id: 1,
          category: {
            id: 2,
            title: 'Child Category',
            info: null,
            content: null,
            slug: 'child',
            post: [],
          },
          parent: {
            id: 1,
            title: 'Parent Category',
            info: null,
            content: null,
            slug: 'parent',
            post: [],
          },
        },
      ];

      service.getTaxonomy().subscribe(taxonomy => {
        expect(taxonomy).toEqual(mockTaxonomy);
        expect(taxonomy[0].parent.title).toBe('Parent Category');
      });

      const req = httpMock.expectOne(`${baseUrl}/taxonomy`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTaxonomy);
    });
  });

  describe('search', () => {
    it('should search posts with query and count', () => {
      const mockResults: IPost[] = [
        {
          id: 1,
          title: 'Search Result 1',
          content: 'Content with search term',
          status: 'published',
          slug: 'result-1',
          views: 50,
          created: new Date(),
          updated: new Date(),
          likes: [],
          category: [],
        },
      ];

      service.search('test query', 10).subscribe(results => {
        expect(results).toEqual(mockResults);
        expect(results.length).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/search?q=test query&count=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResults);
    });

    it('should handle empty search results', () => {
      service.search('nonexistent', 5).subscribe(results => {
        expect(results).toEqual([]);
        expect(results.length).toBe(0);
      });

      const req = httpMock.expectOne(`${baseUrl}/search?q=nonexistent&count=5`);
      req.flush([]);
    });
  });

  describe('createLike', () => {
    it('should create a like', () => {
      const mockLike: Like = {
        id: 1,
        value: true,
      };

      service.createLike(1, true).subscribe(like => {
        expect(like).toEqual(mockLike);
        expect(like.value).toBe(true);
      });

      const req = httpMock.expectOne(`${baseUrl}/likes`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ post: 1, value: true });
      req.flush(mockLike);
    });

    it('should create a dislike', () => {
      const mockDislike: Like = {
        id: 2,
        value: false,
      };

      service.createLike(1, false).subscribe(like => {
        expect(like).toEqual(mockDislike);
        expect(like.value).toBe(false);
      });

      const req = httpMock.expectOne(`${baseUrl}/likes`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ post: 1, value: false });
      req.flush(mockDislike);
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors in getPostById', () => {
      service.getPostById(999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/posts/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle HTTP errors in search', () => {
      service.search('test', 10).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/search?q=test&count=10`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
