package com.codeboy.mvc.model.dto.request;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class JoinQuizRoomRequest {
    private long memberId;
    private long roomId;

}
