
package com.codeboy.mvc.controller;

import com.codeboy.common.Category;
import com.codeboy.mvc.model.dto.response.ApiResponse;
import com.codeboy.mvc.model.dto.Problem;
import com.codeboy.mvc.model.service.ProblemServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problem")
public class ProblemController {

    @Autowired
    private ProblemServiceImpl problemService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Problem>>> getProblems(@RequestParam int limit, @RequestParam Category category) {
        try {
        List<Problem> problems = problemService.getProblems(limit, category);
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(HttpStatus.OK, "문제가 성공적으로 반환되었습니다.", problems));

        }  catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(HttpStatus.BAD_REQUEST, e.getMessage(), null));
        }
    }
}
