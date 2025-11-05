import { TestBed } from '@angular/core/testing';
import { NavigationStateService, NavigationState } from './navigation-state.service';
import { Category } from '../shared';

describe('NavigationStateService', () => {
  let service: NavigationStateService;

  const mockCategory: Category = {
    id: 1,
    title: 'Test Category',
    info: null,
    content: null,
    slug: 'test-category',
    post: [],
  };

  const mockCategories: Category[] = [
    mockCategory,
    {
      id: 2,
      title: 'Another Category',
      info: null,
      content: null,
      slug: 'another-category',
      post: [],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigationStateService],
    });
    service = TestBed.inject(NavigationStateService);

    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have null values in initial state', () => {
      expect(service.selectedRole()).toBeNull();
      expect(service.selectedCategory()).toBeNull();
      expect(service.categories()).toEqual([]);
    });
  });

  describe('setSelectedRole', () => {
    it('should update selected role', () => {
      service.setSelectedRole('Alumnos');

      expect(service.selectedRole()).toBe('Alumnos');
      expect(service.selectedCategory()).toBeNull();
      expect(service.categories()).toEqual([]);
    });

    it('should update role without affecting other state', () => {
      service.setSelectedCategory(mockCategory);
      service.setSelectedRole('Profesores');

      expect(service.selectedRole()).toBe('Profesores');
      expect(service.selectedCategory()).toEqual(mockCategory);
    });
  });

  describe('setSelectedCategory', () => {
    it('should update selected category', () => {
      service.setSelectedCategory(mockCategory);

      expect(service.selectedCategory()).toEqual(mockCategory);
      expect(service.selectedRole()).toBeNull();
    });
  });

  describe('setCategories', () => {
    it('should update categories array', () => {
      service.setCategories(mockCategories);

      expect(service.categories()).toEqual(mockCategories);
      expect(service.categories().length).toBe(2);
    });

    it('should replace existing categories', () => {
      service.setCategories([mockCategory]);
      expect(service.categories().length).toBe(1);

      service.setCategories(mockCategories);
      expect(service.categories().length).toBe(2);
    });
  });

  describe('updateFullState', () => {
    it('should update multiple state properties at once', () => {
      const newState: Partial<NavigationState> = {
        selectedRole: 'Alumnos',
        categories: mockCategories,
      };

      service.updateFullState(newState);

      expect(service.selectedRole()).toBe('Alumnos');
      expect(service.categories()).toEqual(mockCategories);
      expect(service.selectedCategory()).toBeNull();
    });

    it('should update only provided properties', () => {
      service.setSelectedRole('Profesores');
      service.setCategories(mockCategories);

      service.updateFullState({ selectedCategory: mockCategory });

      expect(service.selectedRole()).toBe('Profesores');
      expect(service.categories()).toEqual(mockCategories);
      expect(service.selectedCategory()).toEqual(mockCategory);
    });

    it('should handle empty partial state', () => {
      service.setSelectedRole('Alumnos');
      service.updateFullState({});

      expect(service.selectedRole()).toBe('Alumnos');
    });
  });

  describe('clearState', () => {
    it('should reset all state to initial values', () => {
      service.setSelectedRole('Alumnos');
      service.setSelectedCategory(mockCategory);
      service.setCategories(mockCategories);

      service.clearState();

      expect(service.selectedRole()).toBeNull();
      expect(service.selectedCategory()).toBeNull();
      expect(service.categories()).toEqual([]);
    });
  });

  describe('saveToStorage', () => {
    it('should save state to localStorage', () => {
      service.setSelectedRole('Alumnos');
      service.setCategories(mockCategories);

      service.saveToStorage();

      const stored = localStorage.getItem('navigationState');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.selectedRole).toBe('Alumnos');
      expect(parsed.categories.length).toBe(2);
    });

    it('should save null values correctly', () => {
      service.clearState();
      service.saveToStorage();

      const stored = localStorage.getItem('navigationState');
      const parsed = JSON.parse(stored!);

      expect(parsed.selectedRole).toBeNull();
      expect(parsed.selectedCategory).toBeNull();
      expect(parsed.categories).toEqual([]);
    });
  });

  describe('loadFromStorage', () => {
    it('should load state from localStorage', () => {
      const stateToSave: NavigationState = {
        selectedRole: 'Profesores',
        selectedCategory: mockCategory,
        categories: mockCategories,
      };

      localStorage.setItem('navigationState', JSON.stringify(stateToSave));

      service.loadFromStorage();

      expect(service.selectedRole()).toBe('Profesores');
      expect(service.selectedCategory()).toEqual(mockCategory);
      expect(service.categories()).toEqual(mockCategories);
    });

    it('should handle missing localStorage data', () => {
      service.setSelectedRole('Alumnos');
      service.loadFromStorage();

      // No debería cambiar si no hay datos en localStorage
      expect(service.selectedRole()).toBe('Alumnos');
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('navigationState', 'invalid json {]');

      // No debería lanzar error
      expect(() => service.loadFromStorage()).not.toThrow();
    });

    it('should handle corrupted data in localStorage', () => {
      localStorage.setItem('navigationState', '{"selectedRole": null}');

      service.loadFromStorage();

      // Debería cargar parcialmente los datos válidos
      expect(service.selectedRole()).toBeNull();
    });
  });

  describe('navigationState readonly', () => {
    it('should provide readonly access to full state', () => {
      service.setSelectedRole('Alumnos');
      service.setCategories(mockCategories);

      const state = service.navigationState();

      expect(state.selectedRole).toBe('Alumnos');
      expect(state.categories).toEqual(mockCategories);
      expect(state.selectedCategory).toBeNull();
    });
  });

  describe('state persistence workflow', () => {
    it('should persist and restore state correctly', () => {
      // Simular flujo completo: configurar, guardar, limpiar, restaurar
      service.updateFullState({
        selectedRole: 'Administración',
        selectedCategory: mockCategory,
        categories: mockCategories,
      });

      service.saveToStorage();
      service.clearState();

      expect(service.selectedRole()).toBeNull();

      service.loadFromStorage();

      expect(service.selectedRole()).toBe('Administración');
      expect(service.selectedCategory()).toEqual(mockCategory);
      expect(service.categories()).toEqual(mockCategories);
    });
  });
});
