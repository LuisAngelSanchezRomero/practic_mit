import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/interfaces/product';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormComponent } from '../product-form/product-form'; // Asegúrate de que esta ruta sea correcta
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html', // ¡CORREGIDO! Asume que el archivo es product-list.html
  styleUrls: ['./product-list.scss'], // ¡CORREGIDO! Asume que el archivo es product-list.scss
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    ProductFormComponent,
    CurrencyPipe
  ]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  dataSource = new MatTableDataSource<Product>([]);
  displayedColumns: string[] = ['id', 'name', 'price', 'stock', 'description', 'actions'];
  loading: boolean = true;
  displayDialog: boolean = false;
  selectedProduct: Product | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getActiveProducts(true).subscribe({
      next: (data) => {
        this.products = data;
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los productos.'
        });
      }
    });
  }

  showDeleteDialog(product: Product): void {
    Swal.fire({
      title: 'Confirmar Desactivación',
      text: `¿Está seguro de desactivar el producto ${product.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct(product.id!);
      }
    });
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        Swal.fire('Desactivado!', 'El producto ha sido desactivado correctamente.', 'success');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        Swal.fire('Error', 'No se pudo desactivar el producto.', 'error');
      }
    });
  }

  restoreProduct(id: number): void {
    Swal.fire({
      title: 'Confirmar Reactivación',
      text: `¿Está seguro de reactivar el producto?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.restoreProduct(id).subscribe({
          next: () => {
            Swal.fire('Reactivado!', 'El producto ha sido reactivado correctamente.', 'success');
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error restoring product:', error);
            Swal.fire('Error', 'No se pudo reactivar el producto.', 'error');
          }
        });
      }
    });
  }

  generateReport(): void {
    this.productService.generatePdfReport().subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'reporte_productos.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
        Swal.fire('Reporte Generado', 'El reporte PDF se ha generado correctamente.', 'success');
      },
      error: (error) => {
        console.error('Error generating report:', error);
        Swal.fire('Error', 'No se pudo generar el reporte.', 'error');
      }
    });
  }

  showEditDialog(product: Product): void {
    this.selectedProduct = { ...product };
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '50vw',
      data: { product: this.selectedProduct }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
      this.selectedProduct = null;
    });
  }

  showAddDialog(): void {
    this.selectedProduct = {
      name: '',
      price: 0,
      stock: 0,
      active: true
    };
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '50vw',
      data: { product: this.selectedProduct }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
      this.selectedProduct = null;
    });
  }

  onDialogClose(saved: boolean): void {
    this.displayDialog = false;
    if (saved) {
      this.loadProducts();
    }
  }
}
