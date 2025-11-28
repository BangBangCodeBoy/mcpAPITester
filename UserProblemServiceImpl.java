package com.codeboy.mvc.model.service;

import com.codeboy.mvc.model.dao.UserProblemDao;
import com.codeboy.mvc.model.dto.UserProblem;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserProblemServiceImpl implements UserProblemService {

    private final UserProblemDao userProblemDao;

    public UserProblemServiceImpl(UserProblemDao userProblemDao) {
        this.userProblemDao = userProblemDao;
    }

    @Override
    public List<UserProblem> getProblemsByUserProblemSetId(Long userProblemSetId) {
        return userProblemDao.selectProblemsByUserProblemSetId(userProblemSetId);
    }

    @Override
    public int addUserProblems(List<UserProblem> userProblems) {
        if (userProblems == null || userProblems.isEmpty()) {
            throw new IllegalArgumentException("등록할 문제가 하나 이상 있어야 합니다.");
        }
        return userProblemDao.insertUserProblemList(userProblems);
    }

    @Override
    public int updateUserProblem(UserProblem userProblem) {
        if (userProblem == null || userProblem.getUserProblemId() == null) {
            throw new IllegalArgumentException("수정할 문제를 찾을 수 없습니다. 문제Id를 확인하세요.");
        }
        return userProblemDao.updateUserProblem(userProblem);
    }

    @Override
    public int deleteUserProblem(Long userProblemId) {
        if (userProblemId == null) {
            throw new IllegalArgumentException("삭제할 문제를 찾을 수 없습니다. 삭제할 문제 ID를 확인하세요.");
        }
        return userProblemDao.deleteUserProblemById(userProblemId);
    }
}
