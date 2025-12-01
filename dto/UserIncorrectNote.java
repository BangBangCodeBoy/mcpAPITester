package com.codeboy.mvc.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description="유저문제오답노트 DTO")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserIncorrectNote {
	private long userIncorrectNoteId;
	private long memberId;
	private long userProblemId;
}
