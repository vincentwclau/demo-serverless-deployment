package com.demo.seminar.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "applications")
@Getter
@Setter
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;

    private LocalDate dateOfBirth;

    private String gender;

    private String occupation;

    private String industry;

    @Column(nullable = false)
    private String seminarSession;

    private String dietaryRequirement;

    private String source;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(nullable = false)
    private boolean agreedToTerms;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}
