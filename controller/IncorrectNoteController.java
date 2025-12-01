package com.codeboy.mvc.controller;

import com.codeboy.mvc.model.dto.request.IncorrectNoteRequest;
import com.codeboy.mvc.model.dto.response.ApiResponse;
import com.codeboy.mvc.model.dto.response.IncorrectNoteResponse;
import com.codeboy.mvc.model.service.IncorrectNoteService;

import jakarta.servlet.http.HttpSession;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/incorrect-note")
public class IncorrectNoteController {

    private final IncorrectNoteService incorrectNoteService;

    public IncorrectNoteController(IncorrectNoteService incorrectNoteService) {
        this.incorrectNoteService = incorrectNoteService;
    }

    //한 회원의 오답노트를 모두 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<IncorrectNoteResponse>>> getIncorrectNote(HttpSession session) {
        try {
            //TODO : 세션 or spring security에서 memberId 가져오기
            Long memberId = (Long) session.getAttribute("memberId");
            List<IncorrectNoteResponse> incorrectNoteList = incorrectNoteService.getIncorrectNoteList(memberId);
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(HttpStatus.OK, "오답노트가 성공적으로 조회되었습니다", incorrectNoteList));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure(HttpStatus.BAD_REQUEST, e.getMessage()));
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure(HttpStatus.NOT_FOUND, e.getMessage()));
        }
    }

    //오답노트에 문제 넣기
    @PostMapping
    public ResponseEntity<ApiResponse<Long>> addIncorrectNote(@RequestBody IncorrectNoteRequest incorrectNoteRequest, HttpSession session) {
        //TODO : 세션에서 멤버 id 가져오기
        Long memberId = (Long) session.getAttribute("memberId");
        Long problemId = incorrectNoteRequest.getProblemId();
        Long userProblemId = incorrectNoteRequest.getUserProblemId();
        Boolean isUserProblem = incorrectNoteRequest.getIsUserProblem();

        try {
            Long incorrectNoteId = incorrectNoteService.addIncorrectNote(memberId, problemId, userProblemId, isUserProblem);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(HttpStatus.CREATED, "오답노트를 성공적으로 생성하였습니다.", incorrectNoteId));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure(HttpStatus.BAD_REQUEST, e.getMessage()));
        }

    }

    @DeleteMapping("/{incorrectNoteId}")
    public ResponseEntity<ApiResponse<String>> deleteIncorrectNote(@PathVariable long incorrectNoteId) {

        try {
            incorrectNoteService.deleteIncorrectNote(incorrectNoteId);
            return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK, "오답노트가 삭제되었습니다"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure(HttpStatus.BAD_REQUEST, e.getMessage()));
        }
    }
}
