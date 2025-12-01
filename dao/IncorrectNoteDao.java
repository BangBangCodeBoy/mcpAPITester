package com.codeboy.mvc.model.dao;

import java.util.List;
import java.util.Map;

import com.codeboy.mvc.model.dto.response.IncorrectNoteResponse;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface IncorrectNoteDao {

    //유저의 아이디로 유저가 틀린 문제들의 모음을 조회
    //sql의 관점에서
    //
    public List<IncorrectNoteResponse> selectIncorrectProblems(Long memberId);

    //유저가 자신의 오답노트 안에서 문제를 삭제
    public int deleteIncorrectProblem(Long incorrectNoteId);

    //오답노트에 문제 추가
    public void insertIncorrectProblem(Map<String, Object> params);

    //문제 존재 여부 체크
    boolean existsProblemById(Long problemId);

    //유저 문제 존재 여부 체크
    boolean existsUserProblemById(Long userProblemId);

    //incorrectNoteId 존재 여부 체크
    boolean existsIncorrectNoteById(Long incorrectNoteId);

}
