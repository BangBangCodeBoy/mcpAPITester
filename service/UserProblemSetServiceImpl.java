package com.codeboy.mvc.model.service;

import com.codeboy.mvc.model.dao.UserProblemSetDao;
import com.codeboy.mvc.model.dto.UserProblemSet;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class UserProblemSetServiceImpl implements UserProblemSetService {

    private final UserProblemSetDao userProblemSetDao;

    public UserProblemSetServiceImpl(UserProblemSetDao userProblemSetDao) {
        this.userProblemSetDao = userProblemSetDao;
    }

    @Override
    public List<UserProblemSet> getAllUserProblemSets() {
        return userProblemSetDao.selectUserProblemSets();
    }

    @Override
    public UserProblemSet getUserProblemSetByMemberId(Long memberId) {
    	long memberIdl = memberId;
        return userProblemSetDao.selectUserProblemSetByMemberId(memberIdl);
    }

    @Override
    public int createUserProblemSet(UserProblemSet set) {
        if (set.getMemberId() == null) {
            throw new IllegalArgumentException("회원 ID가 필요합니다.");
        }
        long memberId = set.getMemberId();
        return userProblemSetDao.insertUserProblemSet(memberId);
    }

    @Override
    public int deleteUserProblemSet(Long userProblemSetId) {
        if (userProblemSetId == null) {
            throw new IllegalArgumentException("삭제할 문제세트 ID가 필요합니다.");
        }
        return userProblemSetDao.deleteUserProblemSetById(userProblemSetId);
    }
}
