package com.qtplatform.user.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.qtplatform.user.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.Optional;

@Mapper
public interface UserMapper extends BaseMapper<User> {

    @Select("SELECT * FROM users WHERE email = #{email}")
    Optional<User> findByEmail(@Param("email") String email);

    @Select("SELECT * FROM users WHERE username = #{username}")
    Optional<User> findByUsername(@Param("username") String username);

    @Select("SELECT EXISTS(SELECT 1 FROM users WHERE email = #{email})")
    boolean existsByEmail(@Param("email") String email);

    @Select("SELECT EXISTS(SELECT 1 FROM users WHERE username = #{username})")
    boolean existsByUsername(@Param("username") String username);

    @Update("UPDATE users SET last_login_at = NOW(), last_login_ip = #{ip}::inet WHERE id = #{id}")
    void updateLoginInfo(@Param("id") Long id, @Param("ip") String ip);
}
