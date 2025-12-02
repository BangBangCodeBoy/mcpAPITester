package com.codeboy.mvc.model.dao;

import java.util.List;

import com.codeboy.mvc.model.dto.UserScore;

public interface UserScoreDao {
	//스코어 등록
	public int insertScore(UserScore userScore);

	//모든 스코어 조회
	public List<UserScore> selectAllUserScores();

	//한 멤버의 스코어 조회
	public UserScore selectOneUserScore(Long memberId);

	//멤버 스코어 업데이트
	public int updateUserScore(UserScore userScore);


}
