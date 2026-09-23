package com.pedidos360_orders.ms_pedidos360_orders.controller;

import com.pedidos360_orders.ms_pedidos360_orders.model.Pedido;
import com.pedidos360_orders.ms_pedidos360_orders.repository.PedidoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class PedidoController {

    private final PedidoRepository repository;

    public PedidoController(PedidoRepository repository) {
        this.repository = repository;
    }

    // Leer todos los pedidos (Para Admin y Operador)
    @GetMapping
    public List<Pedido> listarTodos() {
        return repository.findAll();
    }

    // Crear un nuevo pedido (Para Cliente)
    @PostMapping
    public Pedido crear(@RequestBody Pedido pedido) {
        pedido.setEstado("CREADO"); // Regla de negocio: inicia como CREADO
        return repository.save(pedido);
    }

    // Cambiar el estado del pedido (Para Operador)
    @PutMapping("/{id}/estado")
    public Pedido cambiarEstado(@PathVariable Long id, @RequestParam String nuevoEstado) {
        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setEstado(nuevoEstado);
        return repository.save(pedido);
    }
}