package com.codeboy.mvc.model.dto;

import com.codeboy.common.Category;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Schema(description="공식 문제 DTO")
public class Problem {
    private long problemId;
    private String problemDescription;
    private String choice1;
    private String choice2;
    private String choice3;
    private String choice4;
    private String answer;
    private Category category;

}
