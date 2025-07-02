import { Component, EventEmitter, Input, OnInit, Output, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../core/interfaces/product';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog'; // Importaciones de módulos de diálogo de Material

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule, // ¡AÑADIDO! Necesario para <mat-dialog-content>, <mat-dialog-actions> y <mat-dialog-title>
    MatDialogTitle, // Importa MatDialogTitle para usarlo directamente si es necesario
    MatDialogContent, // Importa MatDialogContent
    MatDialogActions // Importa MatDialogActions
  ]
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Product>();

  productForm: FormGroup;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    @Optional() public dialogRef: MatDialogRef<ProductFormComponent>, // DESCOMENTADO Y AÑADIDO @Optional()
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any // DESCOMENTADO Y AÑADIDO @Optional() y @Inject
  ) {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.maxLength(500)]],
      active: [true]
    });
  }

  ngOnInit(): void {
    // Si el componente se abre como un diálogo de Material, el producto se pasa a través de 'data'
    if (this.data && this.data.product) {
      this.product = this.data.product;
    }

    if (this.product && this.product.id) {
      this.isEditing = true;
      this.productForm.patchValue(this.product);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor complete todos los campos requeridos correctamente'
      });
      return;
    }

    const productData = this.productForm.value;
    this.save.emit(productData);
    // Si el componente se abre como un diálogo de Material, ciérralo con los datos
    if (this.dialogRef) {
      this.dialogRef.close(productData);
    }
  }

  onClose(): void {
    this.close.emit();
    // Si el componente se abre como un diálogo de Material, ciérralo sin datos
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  get name() { return this.productForm.get('name'); }
  get price() { return this.productForm.get('price'); }
  get stock() { return this.productForm.get('stock'); }
  get description() { return this.productForm.get('description'); }
}
