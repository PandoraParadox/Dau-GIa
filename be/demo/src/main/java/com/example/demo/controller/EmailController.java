package com.example.demo.controller;

import com.example.demo.dto.request.PasswordDTO;
import com.example.demo.dto.response.ResponseData;
import com.example.demo.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/forgot-password")
@RequiredArgsConstructor
@Slf4j
public class EmailController {
    private final EmailService emailService;

    @PostMapping("")
    public ResponseData<?> forgotPassword (@RequestParam("email") String email) {
        try {
            log.info("Send email verification successfully");
            this.emailService.sendSimpleEmail(email);
            return new ResponseData<>(HttpStatus.OK.value(),"Send email verification successfully") ;
        }
        catch (Exception e) {
            log.error("User not found with email {}", email);
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),e.getMessage());
        }
    }
    @PostMapping("/change-password")
    public ResponseData<?> changePassword (@RequestBody PasswordDTO passwordDTO) {
        try {
            this.emailService.changePassword(passwordDTO);
            log.info("Change password successful with email : {}" );
            return new ResponseData<>(HttpStatus.OK.value(),"Change password successful with email :" + passwordDTO.getEmail()) ;
        }
        catch (Exception e) {
            log.error("Verification code not true {}");
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),e.getMessage());
        }
    }
}
