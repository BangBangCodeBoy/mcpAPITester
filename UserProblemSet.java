package com.codeboy.mvc.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "유저제작문제세트 DTO")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserProblemSet {
	private Long userProblemSetId;
	private Long memberId;
}
