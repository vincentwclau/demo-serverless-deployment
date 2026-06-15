package com.demo.seminar.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ApplicationRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    private String phone;

    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Occupation is required")
    private String occupation;

    private String industry;

    @NotBlank(message = "Seminar session is required")
    private String seminarSession;

    private String dietaryRequirement;

    private String source;

    private String remarks;

    @AssertTrue(message = "You must agree to the terms and conditions")
    private boolean agreedToTerms;
}
