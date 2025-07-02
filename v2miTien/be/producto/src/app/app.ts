import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // ¡Añadido: Esto es crucial para que funcione con componentes standalone!
  imports: [RouterOutlet], // RouterOutlet es necesario para el enrutamiento
  templateUrl: './app.html', // Tu plantilla HTML principal
  styleUrl: './app.scss'     // Tus estilos CSS/SCSS principales
})
export class App { // La clase de tu componente principal
  protected title = 'producto'; // Propiedad de ejemplo para el título
}
