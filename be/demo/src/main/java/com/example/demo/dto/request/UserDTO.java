package com.example.demo.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class UserDTO implements Serializable {

    private Long id ;
    private String email;

    private String password;

    private String retypePassword;

    private String fullName;

    private String address;

    private LocalDate dateOfBirth;

    private String role ;


}
