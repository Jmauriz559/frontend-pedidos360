import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadOrders();
  }


  loadOrders(): void {
    const apiUrl = `${environment.apiUrl}/api/pedidos`;
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => { this.orders = data; },
      error: (err) => { console.error('Error al cargar pedidos:', err); }
    });
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    const apiUrl = `${environment.apiUrl}/api/orders/${orderId}/status`;
    this.http.put(apiUrl, { status: newStatus }).subscribe({
      next: () => { this.loadOrders(); },
      error: (err) => { alert('No tienes permisos o la acción no está permitida.'); }
    });
  }
}