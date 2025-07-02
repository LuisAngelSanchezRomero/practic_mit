import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from './product-form'; // Asegúrate de que la ruta y el nombre sean correctos
import { Product } from '../../../core/interfaces/product';

// Importaciones de Angular Material para las pruebas
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Para probar el diálogo de Material
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Necesario para componentes de Material en pruebas

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Si ProductFormComponent es standalone, se importa directamente aquí
      // y no se usa 'declarations'.
      imports: [
        ReactiveFormsModule,
        ProductFormComponent, // Importa el componente ProductFormComponent directamente (si es standalone)
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule, // Importa MatDialogModule para probar componentes de diálogo
        NoopAnimationsModule // Necesario para que las animaciones de Material no den problemas en las pruebas
      ],
      providers: [
        // Provee un mock para MatDialogRef y MAT_DIALOG_DATA si el componente se abre como un diálogo
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values when no product input', () => {
    expect(component.productForm.value).toEqual({
      id: null,
      name: '',
      price: 0,
      stock: 0,
      description: '',
      active: true
    });
  });

  it('should patch form values when product input provided', () => {
    const testProduct: Product = {
      id: 1,
      name: 'Test Product',
      price: 100,
      stock: 10,
      description: 'Test Description',
      active: true
    };

    component.product = testProduct;
    component.ngOnInit();

    expect(component.productForm.value).toEqual(testProduct);
    expect(component.isEditing).toBeTrue();
  });

  it('should emit save event with form values when form is valid', () => {
    spyOn(component.save, 'emit');
    const testProduct: Product = {
      name: 'Valid Product',
      price: 100,
      stock: 10,
      description: 'Valid Description'
    };

    component.productForm.patchValue(testProduct);
    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith(testProduct);
  });

  it('should not emit save event when form is invalid', () => {
    spyOn(component.save, 'emit');
    // SweetAlert2 se encargará de mostrar el mensaje, no MessageService
    // No necesitamos mockear MessageService aquí si no lo usamos directamente en el test.
    const invalidProduct: Product = {
      name: '', // Invalid - required
      price: 0, // Invalid - min 0.01
      stock: -1, // Invalid - min 0
      description: ''
    };

    component.productForm.patchValue(invalidProduct);
    component.onSubmit();

    expect(component.save.emit).not.toHaveBeenCalled();
  });
});
