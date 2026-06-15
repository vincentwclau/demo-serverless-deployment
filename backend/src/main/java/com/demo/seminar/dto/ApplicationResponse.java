package com.demo.seminar.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
public class ApplicationResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String occupation;
    private String industry;
    private String seminarSession;
    private String dietaryRequirement;
    private String source;
    private String remarks;
    private boolean agreedToTerms;
    private Instant createdAt;
}
