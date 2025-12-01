package com.codeboy.mvc.model.dto;

import com.codeboy.common.Category;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "유저문제 DTO")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserProblem {
	private Long userProblemId;
	private String problemDescription;
	private Category category;
	private String choice1;
	private String choice2;
	private String choice3;
	private String choice4;
	private String answer;
	private int commentCount;
	private Long userProblemSetId;
}
