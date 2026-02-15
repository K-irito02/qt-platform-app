package com.qtplatform.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qtplatform.common.entity.AuditLog;
import com.qtplatform.common.repository.AuditLogMapper;
import com.qtplatform.common.response.ApiResponse;
import com.qtplatform.common.response.PageResponse;
import com.qtplatform.common.service.AuditLogService;
import com.qtplatform.product.entity.Product;
import com.qtplatform.product.repository.ProductMapper;
import com.qtplatform.user.entity.User;
import com.qtplatform.user.repository.UserMapper;
import com.qtplatform.comment.entity.ProductComment;
import com.qtplatform.comment.repository.ProductCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final UserMapper userMapper;
    private final ProductMapper productMapper;
    private final ProductCommentMapper commentMapper;
    private final AuditLogService auditLogService;

    @GetMapping("/dashboard/stats")
    public ApiResponse<Map<String, Object>> getDashboardStats() {
        long userCount = userMapper.selectCount(null);
        long productCount = productMapper.selectCount(
                new LambdaQueryWrapper<Product>().eq(Product::getStatus, "PUBLISHED"));
        long totalProducts = productMapper.selectCount(null);
        long pendingComments = commentMapper.selectCount(
                new LambdaQueryWrapper<ProductComment>().eq(ProductComment::getStatus, "PENDING"));

        return ApiResponse.success(Map.of(
                "userCount", userCount,
                "publishedProductCount", productCount,
                "totalProductCount", totalProducts,
                "pendingCommentCount", pendingComments
        ));
    }

    @GetMapping("/audit-logs")
    public ApiResponse<PageResponse<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action) {
        return ApiResponse.success(auditLogService.listLogs(page, size, userId, action));
    }
}
