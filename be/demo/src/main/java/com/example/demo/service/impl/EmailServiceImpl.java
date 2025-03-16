package com.example.demo.service.impl;

import com.example.demo.dto.request.PasswordDTO;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    private static String generatePassword() {
        String upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCase = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String specialCharacters = "!@#$%^&*()-_=+<>?";

        String allCharacters = upperCase + lowerCase + numbers + specialCharacters;

        Random random = new Random();

        // Đảm bảo mật khẩu có ít nhất một ký tự của mỗi loại
        StringBuilder password = new StringBuilder();
        password.append(upperCase.charAt(random.nextInt(upperCase.length())));
        password.append(lowerCase.charAt(random.nextInt(lowerCase.length())));
        password.append(numbers.charAt(random.nextInt(numbers.length())));
        password.append(specialCharacters.charAt(random.nextInt(specialCharacters.length())));

        // Tạo các ký tự còn lại trong mật khẩu
        for (int i = 4; i < 8; i++) {
            password.append(allCharacters.charAt(random.nextInt(allCharacters.length())));
        }

        // Trộn các ký tự trong mật khẩu để tạo sự ngẫu nhiên
        String generatedPassword = password.toString();
        StringBuilder shuffledPassword = new StringBuilder();
        while (generatedPassword.length() > 0) {
            int index = random.nextInt(generatedPassword.length());
            shuffledPassword.append(generatedPassword.charAt(index));
            generatedPassword = generatedPassword.substring(0, index) + generatedPassword.substring(index + 1);
        }

        return shuffledPassword.toString();
    }

    @Override
    public void sendSimpleEmail(String to) throws MessagingException, NotFoundException {
        User user = this.userRepository.findByEmail(to).orElseThrow(() -> new NotFoundException("Can not find user with email :" + to));
        String newPassword = generatePassword();
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
        mimeMessageHelper.setTo(to);
        mimeMessageHelper.setSubject("Verification code");
        mimeMessageHelper.setText("Code : " + newPassword, true);
        user.setPassword(this.passwordEncoder.encode(newPassword));
        this.userRepository.save(user) ;
        mailSender.send(mimeMessage);
    }

    @Override
    public void changePassword(PasswordDTO passwordDTO) throws NotFoundException {
        User user = this.userRepository.findByEmail(passwordDTO.getEmail()).orElseThrow(() -> new NotFoundException("Can not find user with email :" + passwordDTO.getEmail()));
        if (this.passwordEncoder.matches(passwordDTO.getCode(), user.getPassword())) {
            user.setPassword(this.passwordEncoder.encode(passwordDTO.getPassword()));
            this.userRepository.save(user);
        }
        else {
            throw new NotFoundException("Verification code wrong");
        }

    }
}
