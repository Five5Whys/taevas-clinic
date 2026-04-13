package com.taevas.clinic.service;

import com.taevas.clinic.dto.FileUploadResponse;
import com.taevas.clinic.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class FileUploadService {

    private static final long MAX_VIDEO_SIZE = 50L * 1024 * 1024; // 50 MB for video
    private static final long MAX_NONVIDEO_SIZE = 10L * 1024 * 1024; // 10 MB for PDF/image/DOC

    private static final Set<String> VIDEO_EXTENSIONS = Set.of("mp4", "webm", "mov", "m4v");

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "pdf", "jpg", "jpeg", "png", "webp", "bmp", "tiff", "heic", "svg", "doc", "docx",
            "mp4", "webm", "mov", "m4v"
    );

    private static final String UPLOAD_BASE_DIR = "uploads";

    public FileUploadResponse uploadFile(MultipartFile file, String subDirectory) {
        validateFile(file);

        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String storedFileName = UUID.randomUUID() + "." + extension;

        Path uploadDir = Paths.get(UPLOAD_BASE_DIR, subDirectory);
        try {
            Files.createDirectories(uploadDir);
            Path targetPath = uploadDir.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String relativePath = Paths.get(subDirectory, storedFileName).toString().replace("\\", "/");

            log.info("File uploaded: {} -> {}", originalFilename, relativePath);

            return FileUploadResponse.builder()
                    .fileName(originalFilename)
                    .filePath(relativePath)
                    .fileSize(file.getSize())
                    .contentType(file.getContentType())
                    .build();

        } catch (IOException e) {
            log.error("File upload failed: {}", e.getMessage());
            throw new BadRequestException("File upload failed: " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new BadRequestException("File name is missing");
        }

        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException(
                    "File format not allowed. Accepted formats: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        boolean isVideo = VIDEO_EXTENSIONS.contains(extension);
        long limit = isVideo ? MAX_VIDEO_SIZE : MAX_NONVIDEO_SIZE;
        if (file.getSize() > limit) {
            throw new BadRequestException(
                    isVideo ? "Video file exceeds maximum allowed size of 50 MB"
                            : "File exceeds maximum allowed size of 10 MB (videos up to 50 MB)");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
