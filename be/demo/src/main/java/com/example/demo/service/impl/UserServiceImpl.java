package com.example.demo.service.impl;

import com.example.demo.dto.request.ProductDTO;
import com.example.demo.dto.request.UserChangeDTO;
import com.example.demo.dto.request.UserDTO;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.ProductImage;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import com.example.demo.util.JWTToken;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTToken jwtToken;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void save(UserDTO userDTO) throws Exception {
        User user = this.userRepository.findByEmail(userDTO.getEmail()).orElse(null);
        Role role = this.roleRepository.findById(1L).orElse(null);
        if (user != null) {
            throw new Exception("User is exist");
        }
        User newUser = User.builder()
                .address(userDTO.getAddress())
                .role(role)
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .fullName(userDTO.getFullName())
                .dateOfBirth(userDTO.getDateOfBirth())
                .build();
        this.userRepository.save(newUser);
    }

    @Override
    public void updateUser(Long userId , UserChangeDTO userDTO) throws Exception {
        User user = this.userRepository.findById(userId).orElseThrow(()-> new NotFoundException("User not found with id :" + userId ));
        user.setFullName(userDTO.getFullName());
        user.setDateOfBirth(userDTO.getDateOfBirth());
        user.setEmail(userDTO.getEmail());
        user.setAddress(userDTO.getAddress());
        user.setBalance(user.getBalance());
        this.userRepository.save(user);
    }

    @Override
    public String login (String email, String password) throws Exception {
        User user = this.userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        if (!this.passwordEncoder.matches(password,user.getPassword())) {
            throw new BadCredentialsException("Wrong password");
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user.getEmail(), password ,user.getAuthorities());
        this.authenticationManager.authenticate(authenticationToken);
        String token = this.jwtToken.generateToken(user) ;
        return token;
    }

    private List<String> handleUrlResource(List<ProductImage> productImages) {
        List<String> resources = new ArrayList<>();
        for (ProductImage productImage : productImages) {
            resources.add(productImage.getUrl());
        }
        return resources;
    }

    @Override
    public List<ProductDTO> getProductsInCart(String email) throws NotFoundException {
        User user = this.userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Can not find user with email :" + email)) ;
        List<ProductDTO> list = user.getProducts().stream().map((product -> {
            return ProductDTO.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .startingPrice(product.getStartingPrice())
                    .urlResources(this.handleUrlResource(product.getProductImages()))
                    .category(product.getCategory().getName())
                    .build() ;
        })).toList() ;
        return list;
    }

    @Override
    public UserDTO getUserByEmail(String email) throws NotFoundException {
        User user = this.userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException(String.format("User not found with email : %s" , email))) ;

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .address(user.getAddress())
                .fullName(user.getFullName())
                .dateOfBirth(user.getDateOfBirth())
                .build();
    }

    @Override
    public List<UserDTO> getAllAccounts() {
        return this.userRepository.findAll().stream().map((user) -> {
            return UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .address(user.getAddress())
                    .fullName(user.getFullName())
                    .dateOfBirth(user.getDateOfBirth())
                    .role(user.getRole().getName())
                    .build();
        }).toList();
    }

    @Override
    public List<UserDTO> getAllByRole(String role) {
        return this.userRepository.getAllByRole(role).stream().map((user) -> {
            return UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .address(user.getAddress())
                    .fullName(user.getFullName())
                    .dateOfBirth(user.getDateOfBirth())
                    .role(user.getRole().getName())
                    .build();
        }).toList();
    }

    @Override
    public List<UserDTO> findByUsernameOrEmail(String search) {
        return this.userRepository.findByUsernameOrEmail(search).stream().map((user) -> {
            return UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .address(user.getAddress())
                    .fullName(user.getFullName())
                    .dateOfBirth(user.getDateOfBirth())
                    .role(user.getRole().getName())
                    .build();
        }).toList();
    }

    @Override
    public UserDTO getUserById(Long id) throws NotFoundException {
        User user = this.userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found with id :" + id));
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .address(user.getAddress())
                .fullName(user.getFullName())
                .dateOfBirth(user.getDateOfBirth())
                .role(user.getRole().getName())
                .build();
    }

    @Override
    public void deleteById(Long id) throws NotFoundException {
        User user = this.userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found with id :" + id));
        user.getTransactions().stream().forEach((u) -> {
            user.removeTransaction(u);
        });
        this.userRepository.delete(user);
    }


}
