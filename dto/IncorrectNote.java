package com.codeboy.mvc.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Schema(description="오답 노트 DTO")
public class IncorrectNote {
    private long incorrectNoteId;
    private long memberId;
    private long problemId;
    private long userProblemId;
    private Boolean isUserProblem;
    
}
