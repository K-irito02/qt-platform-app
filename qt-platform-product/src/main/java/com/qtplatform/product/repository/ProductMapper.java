package com.qtplatform.product.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.qtplatform.product.entity.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.Optional;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {

    @Select("SELECT * FROM products WHERE slug = #{slug}")
    Optional<Product> findBySlug(@Param("slug") String slug);

    @Select("SELECT EXISTS(SELECT 1 FROM products WHERE slug = #{slug})")
    boolean existsBySlug(@Param("slug") String slug);

    @Update("UPDATE products SET download_count = download_count + #{count} WHERE id = #{productId}")
    void incrementDownloadCount(@Param("productId") Long productId, @Param("count") long count);

    @Update("UPDATE products SET view_count = view_count + 1 WHERE id = #{productId}")
    void incrementViewCount(@Param("productId") Long productId);

    @Update("UPDATE products SET rating_average = #{avg}, rating_count = #{count} WHERE id = #{productId}")
    void updateRating(@Param("productId") Long productId, @Param("avg") double avg, @Param("count") int count);
}
