package com.example.demo.util.anotations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TimeFormatValidator implements ConstraintValidator<ValidTimeFormat, String> {
    private static final String TIME_PATTERN = "^(?:[0-5]?[0-9]):(?:[0-5]?[0-9])$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // Nếu giá trị null thì bỏ qua, không valid
        if (value == null) {
            return false;
        }
        return value.matches(TIME_PATTERN);
    }
}