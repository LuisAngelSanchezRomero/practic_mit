import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente con su nombre de clase correcto
import { ProductListComponent } from '../product-list/product-list'; // ¡Aquí está la corrección!

describe('ProductListComponent', () => { // Se recomienda que el describe use el nombre correcto también
  let component: ProductListComponent; // Usa el nombre correcto
  let fixture: ComponentFixture<ProductListComponent>; // Usa el nombre correcto

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent] // Si es standalone, esto está bien
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent); // Usa el nombre correcto
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});