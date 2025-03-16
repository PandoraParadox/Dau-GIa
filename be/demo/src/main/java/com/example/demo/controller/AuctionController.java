package com.example.demo.controller;

import com.example.demo.dto.request.AuctionDTO;
import com.example.demo.dto.response.ResponseData;
import com.example.demo.service.AuctionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/auction")
@Slf4j
@RequiredArgsConstructor
@Validated
public class AuctionController {
    private final AuctionService auctionService;

    @GetMapping("/{productId}")
    public ResponseData<?> getAuctionByProductId(@PathVariable("productId") Long productId) {
        try {
            AuctionDTO result = this.auctionService.getAuctionByProductId(productId);
            log.info("Get auction successful with product id : {}" , productId);
            return new ResponseData<>(HttpStatus.OK.value(),"Get auction successful with product id : " + productId  , result) ;
        }
        catch (Exception e) {
            log.info("Get auction failed with product id : {} , message : {}" , productId , e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),"Get auction failed with product id : " + productId);
        }
    }

    @PostMapping("/place-bid")
    public ResponseData<?> placeBid(@Valid @RequestBody AuctionDTO auctionDTO) {
        try {
            AuctionDTO result =  this.auctionService.placeBid(auctionDTO);
            log.info(" {} auctioned successful ", auctionDTO.getEmail());
            return new ResponseData<>(HttpStatus.OK.value(),auctionDTO.email + " auctioned successful" , result);
        } catch (Exception e) {
            log.error("Error in place bid", e);
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Have error in place bid :" + e.getMessage());
        }
    }
}
