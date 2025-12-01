package com.codeboy.mvc.model.service;

import com.codeboy.mvc.model.dto.UserProblem;

import java.util.List;

public interface UserProblemService {

    List<UserProblem> getProblemsByUserProblemSetId(Long userProblemSetId);

    int addUserProblems(List<UserProblem> userProblems);

    int updateUserProblem(UserProblem userProblem);

    int deleteUserProblem(Long userProblemId);
}
