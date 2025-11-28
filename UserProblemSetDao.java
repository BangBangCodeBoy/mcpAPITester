package com.codeboy.mvc.model.dao;

import com.codeboy.mvc.model.dto.Problem;
import com.codeboy.mvc.model.dto.UserProblem;
import com.codeboy.mvc.model.dto.UserProblemSet;

import java.util.List;

public interface UserProblemSetDao {
    //다른 사용자들이 만든 유저제작 문제세트들을 모두 조회
    List<UserProblemSet> selectUserProblemSets();
    

    //마이페이지에서 자신이 제작한 문제세트 조회
    UserProblemSet selectUserProblemSetByMemberId(Long memberId);

    //문제 세트 등록 memberId = 문제 제작자만 넘겨주고 문제들은 problemDao에서 insertUserProblem으로 넣음 (마이페이지에서 생성)
    int insertUserProblemSet(Long memberId);

    // 문제세트 삭제 (마이페이지에서 삭제)
    int deleteUserProblemSetById(Long userProblemSetId);



}
