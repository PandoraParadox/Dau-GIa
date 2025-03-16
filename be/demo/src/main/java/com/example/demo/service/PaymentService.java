package com.example.demo.service;

import com.example.demo.dto.response.PaymentDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public interface PaymentService {
    public PaymentDTO.VNPayResponse createVnPayPayment(HttpServletRequest request) ;
}
