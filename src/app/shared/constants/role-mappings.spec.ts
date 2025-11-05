import { urlToApiRole, apiToUrlRole, isValidRoleSlug, ROLE_MAPPINGS } from './role-mappings';

describe('role-mappings utilities', () => {
  describe('ROLE_MAPPINGS constant', () => {
    it('should have all expected role mappings', () => {
      expect(ROLE_MAPPINGS.alumnos).toBe('Alumnos');
      expect(ROLE_MAPPINGS.profesores).toBe('Profesores');
      expect(ROLE_MAPPINGS.administracion).toBe('Administración');
    });

    it('should have exactly 3 mappings', () => {
      const keys = Object.keys(ROLE_MAPPINGS);
      expect(keys.length).toBe(3);
    });
  });

  describe('urlToApiRole', () => {
    it('should convert alumnos URL slug to API role', () => {
      expect(urlToApiRole('alumnos')).toBe('Alumnos');
    });

    it('should convert profesores URL slug to API role', () => {
      expect(urlToApiRole('profesores')).toBe('Profesores');
    });

    it('should convert administracion URL slug to API role', () => {
      expect(urlToApiRole('administracion')).toBe('Administración');
    });

    it('should return null for invalid URL slug', () => {
      expect(urlToApiRole('invalid')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(urlToApiRole('')).toBeNull();
    });

    it('should be case sensitive', () => {
      expect(urlToApiRole('Alumnos')).toBeNull();
      expect(urlToApiRole('ALUMNOS')).toBeNull();
    });

    it('should handle undefined as null', () => {
      expect(urlToApiRole(undefined as any)).toBeNull();
    });
  });

  describe('apiToUrlRole', () => {
    it('should convert Alumnos API role to URL slug', () => {
      expect(apiToUrlRole('Alumnos')).toBe('alumnos');
    });

    it('should convert Profesores API role to URL slug', () => {
      expect(apiToUrlRole('Profesores')).toBe('profesores');
    });

    it('should convert Administración API role to URL slug', () => {
      expect(apiToUrlRole('Administración')).toBe('administracion');
    });

    it('should return null for invalid API role', () => {
      expect(apiToUrlRole('InvalidRole')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(apiToUrlRole('')).toBeNull();
    });

    it('should be case sensitive', () => {
      expect(apiToUrlRole('alumnos')).toBeNull();
      expect(apiToUrlRole('ALUMNOS')).toBeNull();
    });

    it('should handle undefined as null', () => {
      expect(apiToUrlRole(undefined as any)).toBeNull();
    });

    it('should handle role without accent mark', () => {
      expect(apiToUrlRole('Administracion')).toBeNull();
    });
  });

  describe('isValidRoleSlug', () => {
    it('should return true for valid role slugs', () => {
      expect(isValidRoleSlug('alumnos')).toBe(true);
      expect(isValidRoleSlug('profesores')).toBe(true);
      expect(isValidRoleSlug('administracion')).toBe(true);
    });

    it('should return false for invalid role slugs', () => {
      expect(isValidRoleSlug('invalid')).toBe(false);
      expect(isValidRoleSlug('teachers')).toBe(false);
      expect(isValidRoleSlug('admin')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidRoleSlug('')).toBe(false);
    });

    it('should return false for capitalized valid slugs', () => {
      expect(isValidRoleSlug('Alumnos')).toBe(false);
      expect(isValidRoleSlug('Profesores')).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidRoleSlug(undefined as any)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidRoleSlug(null as any)).toBe(false);
    });
  });

  describe('bidirectional mapping consistency', () => {
    it('should maintain consistency between urlToApi and apiToUrl', () => {
      const urlRoles = ['alumnos', 'profesores', 'administracion'];

      urlRoles.forEach(urlRole => {
        const apiRole = urlToApiRole(urlRole);
        expect(apiRole).not.toBeNull();

        const backToUrl = apiToUrlRole(apiRole!);
        expect(backToUrl).toBe(urlRole);
      });
    });

    it('should maintain consistency in reverse direction', () => {
      const apiRoles = ['Alumnos', 'Profesores', 'Administración'];

      apiRoles.forEach(apiRole => {
        const urlRole = apiToUrlRole(apiRole);
        expect(urlRole).not.toBeNull();

        const backToApi = urlToApiRole(urlRole!);
        expect(backToApi).toBe(apiRole);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace in input', () => {
      expect(urlToApiRole(' alumnos ')).toBeNull();
      expect(apiToUrlRole(' Alumnos ')).toBeNull();
      expect(isValidRoleSlug(' alumnos ')).toBe(false);
    });

    it('should handle special characters', () => {
      expect(urlToApiRole('alumnos!')).toBeNull();
      expect(apiToUrlRole('Alumnos@')).toBeNull();
      expect(isValidRoleSlug('alumnos#')).toBe(false);
    });

    it('should handle numeric input', () => {
      expect(urlToApiRole('123')).toBeNull();
      expect(apiToUrlRole('456')).toBeNull();
      expect(isValidRoleSlug('789')).toBe(false);
    });
  });
});
