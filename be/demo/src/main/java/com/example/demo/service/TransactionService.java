package com.example.demo.service;

import com.example.demo.dto.request.TransactionDTO;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Transaction;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TransactionService {
    List<TransactionDTO> findAll();

    List<TransactionDTO> findByEmail(String email) throws NotFoundException;

    void saveTransaction(TransactionDTO transactionDTO) throws NotFoundException;

    List<TransactionDTO> findBySearch(String search  , String email) throws NotFoundException;

    List<TransactionDTO> findByDate(String date  , String email) throws NotFoundException;

    List<TransactionDTO> findBySearchAdmin(String date  , String search) throws NotFoundException;





}
