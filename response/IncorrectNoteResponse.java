package com.codeboy.mvc.model.dto.response;

import com.codeboy.common.Category;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class IncorrectNoteResponse {
    private Long incorrectNoteId;
    private String problemDescription;
    private String choice1;
    private String choice2;
    private String choice3;
    private String choice4;
    private String answer;
    private Category category;
}
