package com.codeboy.mvc.model.service;

import java.util.List;

import com.codeboy.mvc.model.dto.UserScore;

public interface UserScoreService {

	
	//회원가입 시 자동으로 리더보드에 보여줄 점수를 등록 디폴트는 0
	int registerScore(UserScore userScore);
	
	//리더보드에 모든 유저들의 점수정보들을 보여줌
	List<UserScore> getAllUserScores();
	
	//한 멤버의 스코어 조회
	UserScore getUserScoreById(Long memberId);
	
	//멤버 스코어 업데이트
	//업데이트된 행 수 반환 
	int updateUser(UserScore userScore);
	
}
