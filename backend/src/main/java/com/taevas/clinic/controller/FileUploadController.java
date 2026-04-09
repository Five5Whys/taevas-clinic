package com.taevas.clinic.controller;

import com.taevas.clinic.dto.ApiResponse;
import com.taevas.clinic.dto.FileUploadResponse;
import com.taevas.clinic.service.FileUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@Tag(name = "File Upload", description = "File upload endpoints")
@RequiredArgsConstructor
public class FileUploadController extends BaseController {

    private final FileUploadService fileUploadService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a file", description = "Upload a file (max 10MB). Accepted formats: pdf, jpg, jpeg, png, webp, bmp, tiff, heic, svg, doc, docx")
    public ResponseEntity<ApiResponse<FileUploadResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", defaultValue = "doctor-profiles") String category) {

        UUID userId = getUserId();
        String subDirectory = category + "/" + userId;

        FileUploadResponse response = fileUploadService.uploadFile(file, subDirectory);
        return ResponseEntity.ok(ApiResponse.success(response, "File uploaded successfully"));
    }
}
