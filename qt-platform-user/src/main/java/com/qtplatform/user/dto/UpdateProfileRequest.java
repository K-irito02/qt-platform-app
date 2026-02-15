package com.qtplatform.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(max = 100, message = "昵称长度不能超过 100 个字符")
    private String nickname;

    @Size(max = 500, message = "简介长度不能超过 500 个字符")
    private String bio;

    private String avatarUrl;

    private String themeConfig;
}
