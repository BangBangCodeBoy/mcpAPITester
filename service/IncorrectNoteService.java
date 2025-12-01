package com.codeboy.mvc.model.service;

import com.codeboy.mvc.model.dao.IncorrectNoteDao;
import com.codeboy.mvc.model.dto.response.IncorrectNoteResponse;
import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IncorrectNoteService {
    @Autowired
    private IncorrectNoteDao incorrectNoteDao;

    public Long addIncorrectNote(Long memberId, Long problemId, Long userProblemId, Boolean isUserProblem) {
        if (!isUserProblem) {
            boolean exists = incorrectNoteDao.existsProblemById(problemId);
            if (!exists) {
                throw new IllegalArgumentException("DB에 존재하지 않는 문제 ID입니다.:" + problemId);
            }
        } else {
            boolean exists = incorrectNoteDao.existsUserProblemById(userProblemId);
            if (!exists) {
                throw new IllegalArgumentException("DB에 존재하지 않는 유저문제 ID입니다.:" + userProblemId);
            }
        }

        //TODO : DB에 존재하는지 검증하는 로직 필요
        if (memberId == null) {
            throw new IllegalArgumentException("유효하지 않은 회원 ID입니다.: " + memberId);
        }
        if ((!isUserProblem && (problemId == null || userProblemId != null)) ||
                (isUserProblem && (problemId != null || userProblemId == null))) {
            throw new IllegalArgumentException("유효하지 않은 문제 ID 입니다.:" );
        }

        Map<String, Object> params = new HashMap<>();
        params.put("memberId", memberId);
        params.put("problemId", problemId);
        params.put("userProblemId", userProblemId);
        params.put("isUserProblem", isUserProblem);

        params.put("incorrectNoteId", null);

        incorrectNoteDao.insertIncorrectProblem(params);

        BigInteger id = (BigInteger) params.get("incorrectNoteId");
        return id != null ? id.longValue() : null;

    }

    public List<IncorrectNoteResponse> getIncorrectNoteList(Long memberId) throws NotFoundException {
        //TODO : DB에 존재하는지 검증하는 로직
//        if (memberId == null || !memberDao.existsById(memberId)) {
//            throw new IllegalArgumentException("유효하지 않은 회원 ID입니다.");
//        }
        if (memberId == null) {
            throw new IllegalArgumentException("유효하지 않은 회원 ID입니다.");
        }
        List<IncorrectNoteResponse> list = incorrectNoteDao.selectIncorrectProblems(memberId);

        if (list == null || list.isEmpty()) {
            throw new NotFoundException("오답노트를 조회할 수 없습니다.");
        }
        return list;
    }

    public void deleteIncorrectNote(long incorrectNoteId) {
        boolean exists = incorrectNoteDao.existsIncorrectNoteById(incorrectNoteId);
        if (!exists) {
            throw new IllegalArgumentException("DB에 존재하지 않는 오답노트ID 입니다.: " + incorrectNoteId);
        }
        incorrectNoteDao.deleteIncorrectProblem(incorrectNoteId);
    }
}
