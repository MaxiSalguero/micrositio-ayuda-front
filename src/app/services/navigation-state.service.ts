import { Injectable, signal } from '@angular/core';
import { Category } from '../shared';

export interface NavigationState {
  selectedRole: string | null;
  selectedCategory: Category | null;
  categories: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  // Estado privado
  private _navigationState = signal<NavigationState>({
    selectedRole: null,
    selectedCategory: null,
    categories: []
  });

  // Señales públicas de solo lectura
  readonly selectedRole = () => this._navigationState().selectedRole;
  readonly selectedCategory = () => this._navigationState().selectedCategory;
  readonly categories = () => this._navigationState().categories;
  readonly navigationState = this._navigationState.asReadonly();

  // Métodos para actualizar el estado
  setSelectedRole(role: string): void {
    this._navigationState.update(state => ({
      ...state,
      selectedRole: role
    }));
  }

  setSelectedCategory(category: Category): void {
    this._navigationState.update(state => ({
      ...state,
      selectedCategory: category
    }));
  }

  setCategories(categories: Category[]): void {
    this._navigationState.update(state => ({
      ...state,
      categories
    }));
  }

  updateFullState(newState: Partial<NavigationState>): void {
    this._navigationState.update(state => ({
      ...state,
      ...newState
    }));
  }

  clearState(): void {
    this._navigationState.set({
      selectedRole: null,
      selectedCategory: null,
      categories: []
    });
  }

  // Método para persistir en localStorage (opcional)
  saveToStorage(): void {
    localStorage.setItem('navigationState', JSON.stringify(this._navigationState()));
  }

  // Método para recuperar de localStorage (opcional)
  loadFromStorage(): void {
    const stored = localStorage.getItem('navigationState');
    if (stored) {
      try {
        const state = JSON.parse(stored) as NavigationState;
        this._navigationState.set(state);
      } catch (error) {
        console.error('Error loading navigation state from storage:', error);
      }
    }
  }
}