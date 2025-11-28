package com.codeboy.mvc.model.requestDto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CommentUpdateRequest {
    //댓글을 업데이트할 때 content만 수정하니 수정할 content만 전달하는 DTO
    private String content;
    private long memberId;
}
