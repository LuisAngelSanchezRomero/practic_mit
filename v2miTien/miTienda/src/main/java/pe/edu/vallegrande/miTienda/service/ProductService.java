package pe.edu.vallegrande.miTienda.service;

import pe.edu.vallegrande.miTienda.model.Product;
import pe.edu.vallegrande.miTienda.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.math.BigDecimal;

// Importaciones de JasperReports
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public List<Product> findByActive(Boolean active) {
        return productRepository.findByActive(active);
    }

    public Optional<Product> findById(Integer id) {
        return productRepository.findById(id);
    }

    public Product save(Product product) {
        if (product.getName() == null || product.getName().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto es requerido");
        }
        if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.valueOf(0)) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor que cero");
        }
        
        if (product.getCreationDate() == null) {
            product.setCreationDate(LocalDateTime.now());
        }
        if (product.getActive() == null) {
            product.setActive(true);
        }
        return productRepository.save(product);
    }

    public Product update(Product product) {
        return productRepository.findById(product.getId())
                .map(existingProduct -> {
                    existingProduct.setName(product.getName());
                    existingProduct.setPrice(product.getPrice());
                    existingProduct.setStock(product.getStock());
                    existingProduct.setDescription(product.getDescription());
                    return productRepository.save(existingProduct);
                })
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + product.getId()));
    }

    public Product delete(Integer id) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setActive(false);
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    public Product restore(Integer id) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setActive(true);
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    public byte[] generateJasperPdfReport() throws Exception {
        InputStream reportStream = getClass().getResourceAsStream("/reports/products_report.jrxml");
        if (reportStream == null) {
            throw new RuntimeException("JasperReports template not found: /reports/products_report.jrxml");
        }
        JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

        List<Product> products = productRepository.findAll();
        JRBeanCollectionDataSource dataSourceBean = new JRBeanCollectionDataSource(products);

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("createdBy", "Valle Grande");

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSourceBean);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        JRPdfExporter exporter = new JRPdfExporter();
        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(byteArrayOutputStream));
        exporter.exportReport();

        return byteArrayOutputStream.toByteArray();
    }
}