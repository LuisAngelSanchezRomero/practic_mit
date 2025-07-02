package pe.edu.vallegrande.miTienda.repository;

import pe.edu.vallegrande.miTienda.model.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    
    List<Product> findByActive(Boolean active);
}