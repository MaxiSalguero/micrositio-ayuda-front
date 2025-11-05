import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [SnackbarService, { provide: MatSnackBar, useValue: spy }],
    });

    service = TestBed.inject(SnackbarService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success snackbar', () => {
    service.success('Success message');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Success message',
      'Cerrar',
      jasmine.objectContaining({
        panelClass: ['success-snackbar'],
      })
    );
  });

  it('should show error snackbar', () => {
    service.error('Error message');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Error message',
      'Cerrar',
      jasmine.objectContaining({
        panelClass: ['error-snackbar'],
      })
    );
  });

  it('should show info snackbar', () => {
    service.info('Info message');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Info message',
      'Cerrar',
      jasmine.objectContaining({
        panelClass: ['info-snackbar'],
      })
    );
  });

  it('should show warning snackbar', () => {
    service.warning('Warning message');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Warning message',
      'Cerrar',
      jasmine.objectContaining({
        panelClass: ['warning-snackbar'],
      })
    );
  });
});
