package com.example.demo.service;

import com.example.demo.dto.request.ProductDTO;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.ResponseData;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Product;
import com.example.demo.util.TypeProduct;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.util.List;

@Service
public interface ProductService {
    List<ProductDTO> findAll() ;
    PageResponse<?> findAllByFilter(int page , int size , String sort , String category , TypeProduct type) ;
    PageResponse<?> findAllBySearch(int page , int size , String sort , String search);
    PageResponse<?> findProductByCategory(int page , int size , String sort , String name) throws Exception;
    ProductDTO addNewProduct(ProductDTO productDTO) throws Exception;
    void handleUploadImage(List<MultipartFile> files , Long id) throws Exception;
    UrlResource getImageByImageName(String url) throws MalformedURLException;
    ProductDTO getProductById(Long id) throws Exception;
    void updateProduct(Long id , ProductDTO productDTO) throws Exception;
    void deleteProduct(Long id) throws Exception;
    void addProductToCart(String email , Long productId) throws NotFoundException;
    void payment (Long userId , Long productId , String amount) throws Exception;



}
