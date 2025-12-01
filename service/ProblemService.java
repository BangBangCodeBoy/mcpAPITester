package com.codeboy.mvc.model.service;

import com.codeboy.common.Category;
import com.codeboy.mvc.model.dto.Problem;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProblemService {

    public List<Problem> getProblems(int limit, Category category);

}
