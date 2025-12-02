package com.codeboy.mvc.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.codeboy.mvc.model.dto.UserScore;
import com.codeboy.mvc.model.service.UserScoreService;
import com.codeboy.mvc.model.dto.response.ApiResponse;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("api/scores")
public class UserScoreController {

    private final UserScoreService userScoreService;

    public UserScoreController(UserScoreService userScoreService) {
        this.userScoreService = userScoreService;
    }

    // 점수 등록
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createUserScore(
            @RequestBody UserScore userScore,
            HttpSession session
    ) {
        Long memberId = (Long) session.getAttribute("memberId");
        if (memberId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
        }

        // 세션의 memberId를 강제로 DTO에 세팅 (신뢰할 수 있는 값)
        userScore.setMemberId(memberId);

        try {
            int result = userScoreService.registerScore(userScore);

            if (result == 0) {
                // SQL은 정상 실행되었지만, 반영된 row가 없음
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure(HttpStatus.BAD_REQUEST, "SQL이 실행됐으나 row가 반영되지 않았습니다."));
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(HttpStatus.CREATED, "점수 등록 성공", null));

        } catch (IllegalArgumentException e) {
            // 파라미터/입력 문제
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure(HttpStatus.BAD_REQUEST, e.getMessage()));

        } catch (Exception e) {
            // 예기치 못한 DB 오류 / 서버 오류
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류로 점수를 등록하지 못했습니다."));
        }
    }

    // 전체 유저 점수 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserScore>>> getAllUserScores(HttpSession session) {
        Long memberId = (Long) session.getAttribute("memberId");
        if (memberId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
        }

        try {
            List<UserScore> scores = userScoreService.getAllUserScores();

            if (scores == null || scores.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure(HttpStatus.NOT_FOUND, "점수 목록이 비어있습니다. UserScore테이블을 확인해주세요."));
            }

            return ResponseEntity.status(HttpStatus.OK)
                    .body(ApiResponse.success(HttpStatus.OK, "점수 목록 조회 성공", scores));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류로 점수 목록을 조회하지 못했습니다."));
        }
    }

    // 특정 유저 점수 조회
    @GetMapping("/{memberId}")
    public ResponseEntity<ApiResponse<UserScore>> getUserScore(
            @PathVariable Long memberId,
            HttpSession session
    ) {
        Long loginMemberId = (Long) session.getAttribute("memberId");
        if (loginMemberId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
        }

       

        try {
            UserScore userScore = userScoreService.getUserScoreById(memberId);

            if (userScore == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure(HttpStatus.NOT_FOUND, "해당 회원의 점수가 존재하지 않습니다."));
            }

            return ResponseEntity.status(HttpStatus.OK)
                    .body(ApiResponse.success(HttpStatus.OK, "점수 조회 성공", userScore));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure(HttpStatus.BAD_REQUEST, e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류로 점수를 조회하지 못했습니다."));
        }
    }

    // 점수 수정 	HttpSession에서 memberId를 가져와 이 사람의 점수를 갱신하는거라 PathVariable이나 @RequestBody가 없다.
    @PutMapping
    public ResponseEntity<ApiResponse<Void>> updateUserScore(
            @RequestBody UserScore userScore,
            HttpSession session
    ) {
        Long memberId = (Long) session.getAttribute("memberId");
        if (memberId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
        }

        // 세션 기준으로 memberId 강제 세팅
        userScore.setMemberId(memberId);

        try {
            int result = userScoreService.updateUser(userScore);

            if (result == 0) {
                // 수정할 row가 없거나, 업데이트 실패
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure(HttpStatus.BAD_REQUEST, "점수 수정에 실패했습니다."));
            }

            return ResponseEntity.status(HttpStatus.OK)
                    .body(ApiResponse.success(HttpStatus.OK, "점수 수정 성공", null));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure(HttpStatus.BAD_REQUEST, e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류로 점수를 수정하지 못했습니다."));
        }
    }
}
