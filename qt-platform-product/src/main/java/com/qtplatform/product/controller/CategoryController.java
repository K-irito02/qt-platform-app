package com.qtplatform.product.controller;

import com.qtplatform.common.response.ApiResponse;
import com.qtplatform.product.dto.CategoryVO;
import com.qtplatform.product.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryVO>> getAllCategories() {
        return ApiResponse.success(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryVO> getCategory(@PathVariable Long id) {
        return ApiResponse.success(categoryService.getCategoryById(id));
    }
}
