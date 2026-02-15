package com.qtplatform.file.controller;

import com.qtplatform.common.response.ApiResponse;
import com.qtplatform.file.entity.FileRecord;
import com.qtplatform.file.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Map<String, Object>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "general") String type,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        FileRecord record = fileStorageService.uploadFile(file, userId, type);
        return ApiResponse.success(Map.of(
                "id", record.getId(),
                "originalName", record.getOriginalName(),
                "filePath", record.getFilePath(),
                "fileSize", record.getFileSize(),
                "mimeType", record.getMimeType() != null ? record.getMimeType() : "",
                "checksumSha256", record.getChecksumSha256()
        ));
    }

    @PostMapping("/upload/image")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Map<String, Object>> uploadImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        FileRecord record = fileStorageService.uploadFile(file, userId, "images");
        return ApiResponse.success(Map.of(
                "id", record.getId(),
                "url", "/uploads/" + record.getFilePath(),
                "originalName", record.getOriginalName()
        ));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ApiResponse<Void> deleteFile(@PathVariable Long id) {
        fileStorageService.deleteFile(id);
        return ApiResponse.success();
    }
}
