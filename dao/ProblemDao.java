package com.codeboy.mvc.model.dao;

import java.util.List;

import com.codeboy.common.Category;
import com.codeboy.mvc.model.dto.Problem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ProblemDao {
	//문제 조회
	public List<Problem> selectProblem(@Param("limit") int limit, @Param("category") Category category);
}