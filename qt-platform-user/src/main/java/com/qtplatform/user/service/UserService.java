package com.qtplatform.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.qtplatform.common.exception.BusinessException;
import com.qtplatform.common.response.ErrorCode;
import com.qtplatform.common.response.PageResponse;
import com.qtplatform.user.dto.UpdateProfileRequest;
import com.qtplatform.user.dto.UserProfileVO;
import com.qtplatform.user.entity.Role;
import com.qtplatform.user.entity.User;
import com.qtplatform.user.repository.RoleMapper;
import com.qtplatform.user.repository.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final RoleMapper roleMapper;

    public UserProfileVO getProfile(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return toProfileVO(user);
    }

    public UserProfileVO getPublicProfile(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        List<String> roles = roleMapper.findRolesByUserId(userId).stream()
                .map(Role::getCode).collect(Collectors.toList());
        return UserProfileVO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }

    public UserProfileVO updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        if (StringUtils.hasText(request.getNickname())) {
            user.setNickname(request.getNickname());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (StringUtils.hasText(request.getAvatarUrl())) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (StringUtils.hasText(request.getThemeConfig())) {
            user.setThemeConfig(request.getThemeConfig());
        }

        userMapper.updateById(user);
        return toProfileVO(user);
    }

    public void updateLanguage(Long userId, String language) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.setLanguage(language);
        userMapper.updateById(user);
    }

    public String getThemeConfig(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return user.getThemeConfig();
    }

    public void updateThemeConfig(Long userId, String themeConfig) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.setThemeConfig(themeConfig);
        userMapper.updateById(user);
        log.info("User {} theme config updated", userId);
    }

    public PageResponse<UserProfileVO> listUsers(int page, int size, String keyword, String status) {
        Page<User> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w
                    .like(User::getUsername, keyword)
                    .or().like(User::getEmail, keyword)
                    .or().like(User::getNickname, keyword));
        }
        if (StringUtils.hasText(status)) {
            wrapper.eq(User::getStatus, status);
        }
        wrapper.orderByDesc(User::getCreatedAt);

        Page<User> result = userMapper.selectPage(pageParam, wrapper);
        List<UserProfileVO> vos = result.getRecords().stream()
                .map(this::toProfileVO).collect(Collectors.toList());

        return PageResponse.of(vos, result.getTotal(), page, size);
    }

    public void updateUserStatus(Long userId, String status) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        user.setStatus(status);
        userMapper.updateById(user);
        log.info("User {} status changed to {}", userId, status);
    }

    private UserProfileVO toProfileVO(User user) {
        List<String> roles = roleMapper.findRolesByUserId(user.getId()).stream()
                .map(Role::getCode).collect(Collectors.toList());
        return UserProfileVO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .status(user.getStatus())
                .language(user.getLanguage())
                .emailVerified(user.getEmailVerified())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .themeConfig(user.getThemeConfig())
                .build();
    }
}
