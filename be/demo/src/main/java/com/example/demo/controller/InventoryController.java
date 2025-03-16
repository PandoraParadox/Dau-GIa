package com.example.demo.controller;

import com.example.demo.dto.response.ResponseData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/inventory")
@Slf4j
@RequiredArgsConstructor
@Validated
public class InventoryController {
    @PostMapping("/{productId}")
    public ResponseData<?> addProductToInventory(@PathVariable("productId") Long productId) {
        try {
            log.error("Successful to add product to inventory with product id : {}", productId);
            return new ResponseData<>(HttpStatus.OK.value(), "Successful to add product to inventory with product id : " + productId);
        }
        catch (Exception e) {
            log.error("Failed to add product to inventory : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
        }
    }
}
