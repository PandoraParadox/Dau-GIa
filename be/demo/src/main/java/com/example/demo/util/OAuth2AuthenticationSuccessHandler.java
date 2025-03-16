package com.example.demo.util;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Random;

@Component
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTToken jwtService;
    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    @Autowired
    public OAuth2AuthenticationSuccessHandler(JWTToken jwtService, UserRepository userRepository , RoleRepository roleRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    private static String generateEmail() {
        // Tạo số ngẫu nhiên từ 1000 đến 9999 để thêm vào hậu tố
        Random random = new Random();
        int randomNumber = random.nextInt(9000) + 1000;  // Tạo số từ 1000 đến 9999

        return "test" + randomNumber + "@example.com"; // Tạo email giả với tiền tố "test" và hậu tố là số
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        System.out.println(oAuth2User);
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        Role role = this.roleRepository.findByName("USER").orElse(null) ;

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email == null ? this.generateEmail() : email);
            newUser.setFullName(name);
            newUser.setRole(role);
            return userRepository.save(newUser);
        });

        String token = jwtService.generateToken(user);
        log.info("Authorization OAuth2 successful");
        response.sendRedirect("http://localhost:3001/oauth/successful?token=" + token);
    }
}


