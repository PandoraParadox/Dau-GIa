package com.example.demo.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class UserChangeDTO implements Serializable {
    @Email
    private String email;

    @NotBlank(message = "full name can not be blank")
    private String fullName;

    @NotBlank(message = "address can not be blank")
    private String address;

    private String balance;

    private LocalDate dateOfBirth;
}
