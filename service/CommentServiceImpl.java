package com.codeboy.mvc.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codeboy.mvc.model.dao.CommentDao;
import com.codeboy.mvc.model.dto.Comment;

@Service
public class CommentServiceImpl implements CommentService {

	private final CommentDao commentDao;

	@Autowired
	public CommentServiceImpl(CommentDao commentDao) {
		this.commentDao = commentDao;
	}

	
	
	// 유저제작 문제 세트Id로 조회
	@Override
	public List<Comment> getAllCommentsById(Long userProblemSetId) {
		return commentDao.selectCommentsByuserProblemSetId(userProblemSetId);
	}
	
	@Override
	public int addComment(Long userProblemSetId, Comment comment ) {

		return commentDao.insertComment(userProblemSetId, comment);
	}



	@Override
	public int updateComment(Long commentId, Comment comment) {
		return commentDao.updateComment(commentId, comment);
		
	}



	@Override
	public int deleteComment(Long commentId) {
		return commentDao.deleteComment(commentId);
		
	}

	
	@Override
    public Long getCommentOwnerId(Long commentId){
        return commentDao.selectCommentOwnerId(commentId);
    }
	
	
}
