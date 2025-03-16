package com.example.demo.util.anotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TimeFormatValidator.class)
@Documented
public @interface ValidTimeFormat {
    String message() default "Thời gian phải đúng định dạng MM:ss";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
