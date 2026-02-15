package com.qtplatform.comment.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.qtplatform.comment.dto.CommentVO;
import com.qtplatform.comment.dto.CreateCommentRequest;
import com.qtplatform.comment.entity.CommentLike;
import com.qtplatform.comment.entity.ProductComment;
import com.qtplatform.comment.repository.CommentLikeMapper;
import com.qtplatform.comment.repository.ProductCommentMapper;
import com.qtplatform.common.exception.BusinessException;
import com.qtplatform.common.response.ErrorCode;
import com.qtplatform.common.response.PageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {

    private final ProductCommentMapper commentMapper;
    private final CommentLikeMapper commentLikeMapper;

    public PageResponse<CommentVO> getProductComments(Long productId, int page, int size, Long currentUserId) {
        Page<ProductComment> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<ProductComment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProductComment::getProductId, productId)
                .eq(ProductComment::getStatus, "PUBLISHED")
                .isNull(ProductComment::getParentId)
                .orderByDesc(ProductComment::getCreatedAt);

        Page<ProductComment> result = commentMapper.selectPage(pageParam, wrapper);
        List<CommentVO> vos = result.getRecords().stream()
                .map(c -> toVOWithReplies(c, currentUserId))
                .collect(Collectors.toList());

        return PageResponse.of(vos, result.getTotal(), page, size);
    }

    @Transactional
    public CommentVO createComment(Long productId, CreateCommentRequest request, Long userId, String ipAddress) {
        // Check for duplicate rating
        if (request.getRating() != null && request.getParentId() == null) {
            LambdaQueryWrapper<ProductComment> ratingCheck = new LambdaQueryWrapper<>();
            ratingCheck.eq(ProductComment::getProductId, productId)
                    .eq(ProductComment::getUserId, userId)
                    .isNotNull(ProductComment::getRating)
                    .isNull(ProductComment::getParentId);
            if (commentMapper.selectCount(ratingCheck) > 0) {
                throw new BusinessException(ErrorCode.DUPLICATE_RATING);
            }
        }

        // Validate parent exists
        if (request.getParentId() != null) {
            ProductComment parent = commentMapper.selectById(request.getParentId());
            if (parent == null || !parent.getProductId().equals(productId)) {
                throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND, "父评论不存在");
            }
        }

        ProductComment comment = ProductComment.builder()
                .productId(productId)
                .userId(userId)
                .parentId(request.getParentId())
                .content(request.getContent())
                .rating(request.getParentId() == null ? request.getRating() : null)
                .status("PENDING")
                .likeCount(0)
                .ipAddress(ipAddress)
                .build();
        commentMapper.insert(comment);

        log.info("Comment created: id={}, product={}, user={}", comment.getId(), productId, userId);
        return toVO(comment, false);
    }

    @Transactional
    public CommentVO updateComment(Long commentId, String content, Long userId) {
        ProductComment comment = commentMapper.selectById(commentId);
        if (comment == null) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND);
        }
        if (!comment.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        comment.setContent(content);
        commentMapper.updateById(comment);
        return toVO(comment, false);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId, boolean isAdmin) {
        ProductComment comment = commentMapper.selectById(commentId);
        if (comment == null) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND);
        }
        if (!isAdmin && !comment.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        commentMapper.deleteById(commentId);
    }

    @Transactional
    public void likeComment(Long commentId, Long userId) {
        if (commentLikeMapper.existsByCommentAndUser(commentId, userId)) {
            throw new BusinessException(ErrorCode.COMMENT_ALREADY_LIKED);
        }
        commentLikeMapper.insert(CommentLike.builder()
                .commentId(commentId)
                .userId(userId)
                .build());
        commentMapper.incrementLikeCount(commentId);
    }

    @Transactional
    public void unlikeComment(Long commentId, Long userId) {
        int deleted = commentLikeMapper.deleteByCommentAndUser(commentId, userId);
        if (deleted > 0) {
            commentMapper.decrementLikeCount(commentId);
        }
    }

    public void auditComment(Long commentId, String status) {
        ProductComment comment = commentMapper.selectById(commentId);
        if (comment == null) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND);
        }
        comment.setStatus(status);
        commentMapper.updateById(comment);

        // If published and has rating, recalculate product rating
        if ("PUBLISHED".equals(status) && comment.getRating() != null) {
            updateProductRating(comment.getProductId());
        }
    }

    public void updateProductRating(Long productId) {
        Double avg = commentMapper.getAverageRating(productId);
        int count = commentMapper.getRatingCount(productId);
        // This needs ProductMapper - will be called from admin module
        // For now just log
        log.info("Product {} rating updated: avg={}, count={}", productId, avg, count);
    }

    public PageResponse<CommentVO> listAllComments(int page, int size, String status, Long productId) {
        Page<ProductComment> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<ProductComment> wrapper = new LambdaQueryWrapper<>();
        if (status != null) wrapper.eq(ProductComment::getStatus, status);
        if (productId != null) wrapper.eq(ProductComment::getProductId, productId);
        wrapper.orderByDesc(ProductComment::getCreatedAt);

        Page<ProductComment> result = commentMapper.selectPage(pageParam, wrapper);
        List<CommentVO> vos = result.getRecords().stream()
                .map(c -> toVO(c, false))
                .collect(Collectors.toList());
        return PageResponse.of(vos, result.getTotal(), page, size);
    }

    private CommentVO toVOWithReplies(ProductComment comment, Long currentUserId) {
        CommentVO vo = toVO(comment, currentUserId != null && commentLikeMapper.existsByCommentAndUser(comment.getId(), currentUserId));

        // Load replies
        LambdaQueryWrapper<ProductComment> replyWrapper = new LambdaQueryWrapper<>();
        replyWrapper.eq(ProductComment::getParentId, comment.getId())
                .eq(ProductComment::getStatus, "PUBLISHED")
                .orderByAsc(ProductComment::getCreatedAt);
        List<ProductComment> replies = commentMapper.selectList(replyWrapper);
        if (!replies.isEmpty()) {
            vo.setReplies(replies.stream()
                    .map(r -> toVO(r, currentUserId != null && commentLikeMapper.existsByCommentAndUser(r.getId(), currentUserId)))
                    .collect(Collectors.toList()));
        } else {
            vo.setReplies(Collections.emptyList());
        }
        return vo;
    }

    private CommentVO toVO(ProductComment c, boolean liked) {
        return CommentVO.builder()
                .id(c.getId())
                .productId(c.getProductId())
                .userId(c.getUserId())
                .parentId(c.getParentId())
                .content(c.getContent())
                .rating(c.getRating())
                .status(c.getStatus())
                .likeCount(c.getLikeCount())
                .liked(liked)
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
