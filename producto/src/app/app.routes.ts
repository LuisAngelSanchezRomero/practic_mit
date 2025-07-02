import { Routes } from '@angular/router';

// Importa tus componentes de producto desde la ruta correcta
// Asegúrate de que los nombres de las clases exportadas sean 'ProductFormComponent' y 'ProductListComponent'
import { ProductFormComponent } from './feature/product/product-form/product-form'; // ¡CORREGIDO! Añadido .component
import { ProductListComponent } from './feature/product/product-list/product-list'; // ¡CORREGIDO! Añadido .component

export const routes: Routes = [
    {
        path: 'product-form',          // Ruta para el formulario de productos
        component: ProductFormComponent         // Componente asociado a la ruta
    },
    {
        path: 'product-list',         // Ruta para la lista de productos
        component: ProductListComponent         // Componente asociado a la ruta
    },
    {
        path: '',                     // Ruta por defecto (vacía)
        pathMatch: 'full',            // Coincide exactamente con la ruta vacía
        redirectTo: 'product-form'    // Redirige a 'product-form' si la URL está vacía
    }
];
