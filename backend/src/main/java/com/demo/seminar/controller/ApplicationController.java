package com.demo.seminar.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.demo.seminar.dto.ApplicationRequest;
import com.demo.seminar.dto.ApplicationResponse;
import com.demo.seminar.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApplicationController {

  private final ApplicationService service;

  @GetMapping(value = "/applications")
  public ResponseEntity<Page<ApplicationResponse>> getAll(
      @PageableDefault(size = 7, sort = "createdAt",
          direction = Sort.Direction.DESC) Pageable pageable) {
    System.out.println("Get All Applications");
    return ResponseEntity.ok(service.getAllApplications(pageable));
  }

  @PostMapping(value = "/application")
  public ResponseEntity<ApplicationResponse> create(
      @Valid @RequestBody ApplicationRequest request) {
    System.out.println("Submit Application: " + request);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(service.saveApplication(request));
  }
}
