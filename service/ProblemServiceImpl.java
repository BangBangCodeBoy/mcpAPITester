package com.codeboy.mvc.model.service;

import com.codeboy.common.Category;
import com.codeboy.mvc.model.dao.ProblemDao;
import com.codeboy.mvc.model.dto.Problem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemServiceImpl implements ProblemService{
    @Autowired
    private ProblemDao problemDao;

    @Override
    public List<Problem> getProblems(int limit, Category category) {
        if (limit <= 0) {
            throw new IllegalArgumentException("limit의 수는 0이상이어야 합니다. limit: " + limit);
        }
        if (category == null) {
            throw new IllegalArgumentException("category의 값은 null이 될 수 없습니다. : category: ");
        }
        List<Problem> problems = problemDao.selectProblem(limit,category);

        //만약 요청 수보다 존재하는 문제 수가 적다면
        if (limit > problems.size()) {
            throw new IllegalArgumentException("limit의 값은 문제 수보다 클 수 없습니다. problems: " + problems.size());
        }

        return problems;
    }

}
