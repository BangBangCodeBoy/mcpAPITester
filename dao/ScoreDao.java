package com.codeboy.mvc.model.dao;

import java.util.List;

import com.codeboy.mvc.model.dto.UserScore;

public interface ScoreDao {
	//스코어 등록
	public void insertScore(UserScore userScore);

	//모든 스코어 조회
	public List<UserScore> selectAllUserScore();

	//한 멤버의 스코어 조회
	public int selectOneUserScore(Long memberId);

	//멤버 스코어 업데이트
	public void updateUserScore(UserScore userScore);


}
