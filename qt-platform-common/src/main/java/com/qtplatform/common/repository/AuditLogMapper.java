package com.qtplatform.common.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.qtplatform.common.entity.AuditLog;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AuditLogMapper extends BaseMapper<AuditLog> {
}
