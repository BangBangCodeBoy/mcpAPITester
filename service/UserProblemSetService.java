package com.codeboy.mvc.model.service;

import com.codeboy.mvc.model.dto.UserProblemSet;

import java.util.List;

public interface UserProblemSetService {
    List<UserProblemSet> getAllUserProblemSets();

    UserProblemSet getUserProblemSetByMemberId(Long memberId);

    int createUserProblemSet(UserProblemSet set);

    int deleteUserProblemSet(Long userProblemSetId);
}
