package com.demo.seminar.service;

import com.demo.seminar.dto.ApplicationRequest;
import com.demo.seminar.dto.ApplicationResponse;
import com.demo.seminar.model.Application;
import com.demo.seminar.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository repository;

    public Page<ApplicationResponse> getAllApplications(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    public ApplicationResponse saveApplication(ApplicationRequest request) {
        return toResponse(repository.save(toEntity(request)));
    }

    private ApplicationResponse toResponse(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .fullName(app.getFullName())
                .email(app.getEmail())
                .phone(app.getPhone())
                .dateOfBirth(app.getDateOfBirth())
                .gender(app.getGender())
                .occupation(app.getOccupation())
                .industry(app.getIndustry())
                .seminarSession(app.getSeminarSession())
                .dietaryRequirement(app.getDietaryRequirement())
                .source(app.getSource())
                .remarks(app.getRemarks())
                .agreedToTerms(app.isAgreedToTerms())
                .createdAt(app.getCreatedAt())
                .build();
    }

    private Application toEntity(ApplicationRequest r) {
        Application app = new Application();
        app.setFullName(r.getFullName());
        app.setEmail(r.getEmail());
        app.setPhone(r.getPhone());
        app.setDateOfBirth(r.getDateOfBirth());
        app.setGender(r.getGender());
        app.setOccupation(r.getOccupation());
        app.setIndustry(r.getIndustry());
        app.setSeminarSession(r.getSeminarSession());
        app.setDietaryRequirement(r.getDietaryRequirement());
        app.setSource(r.getSource());
        app.setRemarks(r.getRemarks());
        app.setAgreedToTerms(r.isAgreedToTerms());
        return app;
    }
}
