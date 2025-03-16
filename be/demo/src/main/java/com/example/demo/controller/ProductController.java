package com.example.demo.controller;

import com.example.demo.dto.request.ProductDTO;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.ResponseData;
import com.example.demo.service.ProductService;
import com.example.demo.util.TypeProduct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/products")
@Slf4j
@RequiredArgsConstructor
@Validated
public class ProductController {
    private final ProductService productService;

    @GetMapping("")
    public ResponseData<?> getAllProducts() {
        return new ResponseData<>(HttpStatus.OK.value(), "Get all products", this.productService.findAll());
    }

    // by filter
    @GetMapping("/by-filter")
    public ResponseData<?> getAllProductsByFilter(@RequestParam(name = "page") int page,
                                                  @RequestParam(name = "size") int size,
                                                  @RequestParam(required = false) String sort,
                                                  @RequestParam(required = false) String category,
                                                  @RequestParam(required = false) String type
    ) {
        try {
            TypeProduct typeProduct = null ;
            if (type != null) typeProduct = TypeProduct.valueOf(type);
            PageResponse pageResponse = this.productService.findAllByFilter(page, size, sort, category, typeProduct);
            log.info("Get all products by filter successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Get all products by filter successfully", pageResponse);
        } catch (Exception e) {
            log.error("Get all products by filter failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Get all products by filter failed", null);
        }
    }

    @GetMapping("/by-search")
    public ResponseData<?> getAllProductsBySearch(@RequestParam(name = "page") int page,
                                                  @RequestParam(name = "size") int size,
                                                  @RequestParam(required = false) String sort,
                                                  @RequestParam(required = false) String search
    ) {
        try {
            PageResponse pageResponse = this.productService.findAllBySearch(page, size, sort, search);
            log.info("Get all products by search successfully");
            return new ResponseData<>(HttpStatus.OK.value(), "Get all products by search", pageResponse);
        } catch (Exception e) {
            log.error("Get all products failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Get all products", null);
        }
    }

    @GetMapping("/by-categories")
    public ResponseData<?> getAllProductsByCategory(@RequestParam(name = "page") int page,
                                                    @RequestParam(name = "size") int size,
                                                    @RequestParam(required = false) String sort,
                                                    @RequestParam(required = false) String category
    ) {
        try {
            log.info("Get all products by category successfully");
            PageResponse pageResponse = this.productService.findProductByCategory(page, size, sort, category);
            return new ResponseData<>(HttpStatus.OK.value(), "Get all products by category successfully", pageResponse);
        } catch (Exception e) {
            log.error("Get all products by categories failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Get all products", null);
        }
    }


    @PostMapping("")
    public ResponseData<?> addNewProduct(@Valid @RequestBody ProductDTO productDTO) {
        try {
            ProductDTO product = this.productService.addNewProduct(productDTO);
            log.info("Add new product : {}", product);
            return new ResponseData<>(HttpStatus.OK.value(), "Add new product successful", product);
        } catch (Exception e) {
            log.error("Add new product failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Add new product failed", null);
        }
    }

    @PostMapping(value = "/uploads/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseData<?> uploadProductImage(@PathVariable("id") Long id, @RequestParam("files") List<MultipartFile> file) {
        try {
            this.productService.handleUploadImage(file, id);
            log.info("Upload product image successful with id :" + id);
            return new ResponseData<>(HttpStatus.OK.value(), "Upload product image sucessful");
        } catch (Exception e) {
            log.error("Upload product image failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
        }
    }

    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> getImageByImageName(@PathVariable("imageName") String imageName) {
        try {
            UrlResource resource = this.productService.getImageByImageName(imageName);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (Exception e) {
            log.error("Get product image failed : {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseData<?> getProductById(@PathVariable("id") Long id) {
        try {
            ProductDTO productDTO = this.productService.getProductById(id);
            log.info("Get product successful with id :" + id);
            return new ResponseData<>(HttpStatus.OK.value(), "Get product successful by id : " + id, productDTO);

        } catch (Exception e) {
            log.error("Get product failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Get product failed by id : " + id, null);
        }
    }

    @PutMapping("/{id}")
    public ResponseData<?> updateProduct(@PathVariable("id") Long id, @Valid @RequestBody ProductDTO productDTO) {
        try {
            this.productService.updateProduct(id, productDTO);
            log.info("Update product successful with id :" + id);
            return new ResponseData<>(HttpStatus.OK.value(), "Update product successful with id : " + id);
        } catch (Exception e) {
            log.error("Update product failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseData<?> deleteProduct(@PathVariable("id") Long id) {
        try {
            this.productService.deleteProduct(id);
            log.info("Delete product successful with id :" + id);
            return new ResponseData<>(HttpStatus.OK.value(), "Delete product successful with id : " + id);
        } catch (Exception e) {
            log.error("Delete product failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
        }
    }

    @PostMapping("/cart/{user}/{product}")
    public ResponseData<?> addProductToCart(@PathVariable("user") String user, @PathVariable("product") Long product) {
        try {
            this.productService.addProductToCart(user, product);
            log.info("Add product to cart successful with user id :" + user);
            return new ResponseData<>(HttpStatus.OK.value(), "Add product to cart successful with user id : " + user);
        } catch (Exception e) {
            log.error("Add product to cart failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.OK.value(), "Add product to cart failed");
        }
    }

    @DeleteMapping("/payment/{user}/{product}")
    public ResponseData<?> payment(@PathVariable("user") Long user, @PathVariable("product") Long product, @RequestParam String amount) {
        try {
            this.productService.payment(user, product, amount);
            log.info("Payment successful with user id :" + user);
            return new ResponseData<>(HttpStatus.OK.value(), "Payment successful");
        } catch (Exception e) {
            log.error("Payment failed with user id :" + user);
            return new ResponseData<>(HttpStatus.OK.value(), "Payment failed because : " + e.getMessage());
        }
    }


}
