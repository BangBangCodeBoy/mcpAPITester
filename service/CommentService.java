package com.codeboy.mvc.model.service;

import java.util.List;

import com.codeboy.mvc.model.dto.Comment;

public interface CommentService {
    /**
     * 유저제작 문제 세트Id로 조회
     * @param userProblemSetId
     * @return
     */
    public List<Comment> getAllCommentsById(Long userProblemSetId);
    
    //유저제작 문제 세트Id로 조회후 해당 세트에 댓글 작성
    public int addComment(Long userProblemSetId, Comment comment);
//
    public int updateComment(Long commentId, Comment comment);
//
    public int deleteComment(Long commentId);

    public Long getCommentOwnerId(Long commentId);

}
