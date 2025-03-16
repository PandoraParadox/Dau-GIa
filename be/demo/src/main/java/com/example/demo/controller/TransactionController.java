package com.example.demo.controller;

import com.example.demo.dto.request.TransactionDTO;
import com.example.demo.dto.response.ResponseData;
import com.example.demo.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/transactions")
@Slf4j
@RequiredArgsConstructor
@Validated
public class TransactionController {

    private final TransactionService transactionService;
    @GetMapping("")
    public ResponseData<?> getAllTransactions() {
        try {
            List<TransactionDTO> result = this.transactionService.findAll();
            log.info("Get all transactions successful") ;
            return new ResponseData<>(HttpStatus.OK.value(), "Get all transactions successful" , result);
        }
        catch (Exception e) {
            log.error("Get all transactions failed : {}" , e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),"Get all transactions failed");
        }
    }
    @GetMapping("/email")
    public ResponseData<?> getTransactionByEmail(@RequestParam("email") String email) {
        try{
            List<TransactionDTO> result = this.transactionService.findByEmail(email);
           log.info("Get transaction successful by email : {}", email);
           return new ResponseData<>(HttpStatus.OK.value(), "Get transaction successful by email :" + email , result);
        }
        catch (Exception e) {
            log.error("Get transaction by email failed with email : {} , message : {}"  , email , e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),"Get transaction by email failed with email :" + email);
        }
    }
    @GetMapping("/search")
    public ResponseData<?> getTransactionBySearch(@RequestParam("search") String search ,@RequestParam("email") String email ) {
        try {
            List<TransactionDTO> result = this.transactionService.findBySearch(search, email);
            log.info("Get transaction successful by search with email : {}", email);
            return new ResponseData<>(HttpStatus.OK.value(), "Get transaction successful by search with email :" + email , result);
        }
        catch (Exception e) {
            log.error("Get transaction by search failed : {}" , e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),"Get transaction by search failed");
        }
    }

    @GetMapping("/search-admin")
    public ResponseData<?> getTransactionBySearchAdmin(@RequestParam("search") String search ,@RequestParam("date") String date ) {
        try {
            List<TransactionDTO> result = this.transactionService.findBySearchAdmin(date, search);
            log.info("Get transaction successful by search admin");
            return new ResponseData<>(HttpStatus.OK.value(), "Get transaction successful by search admin" , result);
        }
        catch (Exception e) {
            log.error("Get transaction by search admin failed : {}" , e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),"Get transaction by search admin failed");
        }
    }
    @GetMapping("/date")
    public ResponseData<?> getTransactionByDate(@RequestParam("date") String date , @RequestParam("email") String email) {
        try {
            List<TransactionDTO> result = this.transactionService.findByDate(date, email);
            log.info("Get transaction successful by date with email : {}", email);
            return new ResponseData<>(HttpStatus.OK.value(), "Get transaction successful by date with email :" + email , result);
        }
        catch (Exception e) {
            log.error("Get transaction by date failed : {}" , e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),"Get transaction by date failed");
        }
    }
    @PostMapping("")
    public ResponseData<?> createTransaction(@Valid @RequestBody TransactionDTO transactionDTO) {
        try {
            this.transactionService.saveTransaction(transactionDTO);
            log.info("Create transaction successful : {}", transactionDTO);
            return new ResponseData<>(HttpStatus.CREATED.value(), "Create transaction successful");
        }
        catch (Exception e) {
            log.error("Create transaction failed : {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),"Create transaction failed");
        }
    }
}
