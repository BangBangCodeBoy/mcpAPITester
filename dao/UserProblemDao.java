package com.codeboy.mvc.model.dao;

import java.util.List;

import com.codeboy.common.Category;
import com.codeboy.mvc.model.dto.UserProblem;

public interface UserProblemDao extends ProblemDao{

    //유저제작 문제풀이 페이지에서 문제세트를 선택했을때, 그 문제세트에 속한문제들 조회
    List<UserProblem> selectProblemsByUserProblemSetId(Long userProblemSetId);

    //문제 생성 시 문제세트를 등록함과 동시에 문제들을 전부 user_problem 테이블에 넣기
    int insertUserProblemList(List<UserProblem> userProblems);

    //제작자 본인이 자신의 문제들을 수정하는 로직
    int updateUserProblem(UserProblem userProblem);

    //제작자 본인이 자신의 문제를 삭제하는 로직
    int deleteUserProblemById(Long userProblemId);


}

