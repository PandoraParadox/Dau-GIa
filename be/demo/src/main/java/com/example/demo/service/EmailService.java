package com.example.demo.service;

import com.example.demo.dto.request.PasswordDTO;
import com.example.demo.exception.NotFoundException;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    public void sendSimpleEmail(String to) throws MessagingException, NotFoundException;

    public void changePassword(PasswordDTO passwordDTO) throws NotFoundException ;
}
