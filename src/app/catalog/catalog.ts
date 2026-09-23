import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.css']
})
export class CatalogComponent implements OnInit {
  products: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCatalog();
  }

  loadCatalog(): void {
    const apiUrl = `${environment.apiUrl}/api/productos`;
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => { this.products = data; },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
        this.errorMessage = 'No se pudo cargar el catálogo.';
      }
    });
  }
}