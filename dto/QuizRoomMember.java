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
@Schema(description="회원 퀴즈방 중간 DTO")
public class QuizRoomMember {
    private Long quizRoomMemberId;
    private Long memberId;
    private Long roomId;
    private Boolean isHost;
	public Long getQuizRoomMemberId() {
		return quizRoomMemberId;
	}
	public void setQuizRoomMemberId(long quizRoomMemberId) {
		this.quizRoomMemberId = quizRoomMemberId;
	}
	public Long getMemberId() {
		return memberId;
	}
	public void setMemberId(long memberId) {
		this.memberId = memberId;
	}
	public Long getRoomId() {
		return roomId;
	}
	public void setRoomId(long roomId) {
		this.roomId = roomId;
	}
	public Boolean getIsHost() {
		return isHost;
	}
	public void setIsHost(Boolean isHost) {
		this.isHost = isHost;
	}
    
    
}
