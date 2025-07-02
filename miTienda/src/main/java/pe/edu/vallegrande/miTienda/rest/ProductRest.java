package pe.edu.vallegrande.miTienda.rest;

import pe.edu.vallegrande.miTienda.model.Product;
import pe.edu.vallegrande.miTienda.service.ProductService; // La importación sigue siendo la misma
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@CrossOrigin(origins = "*") // Allow Connection with Angular
@RestController
@RequestMapping("/api/products") // Changed request mapping to English plural
public class ProductRest {

    private final ProductService productService; // Sigue siendo ProductService

    @Autowired
    public ProductRest(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.findAll();
    }

    @GetMapping("/active/{active}")
    public List<Product> getProductsByActiveStatus(@PathVariable Boolean active) {
        return productService.findByActive(active);
    }

    @GetMapping("/{id}")
    public Optional<Product> getProductById(@PathVariable Integer id) {
        return productService.findById(id);
    }

    @PostMapping("/save")
    public Product saveProduct(@RequestBody Product product) {
        return productService.save(product);
    }

    @PutMapping("/update/{id}")
    public Product updateProduct(@PathVariable Integer id, @RequestBody Product product) {
        return productService.update(product);
    }

    @PatchMapping("/delete/{id}")
    public Product deleteProduct(@PathVariable Integer id) {
        return productService.delete(id);
    }

    @PatchMapping("/restore/{id}")
    public Product restoreProduct(@PathVariable Integer id) {
        return productService.restore(id);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> generateJasperPdfReport() {
        try {
            byte[] pdf = productService.generateJasperPdfReport();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=products_report.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}