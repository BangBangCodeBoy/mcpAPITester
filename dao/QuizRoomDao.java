package com.codeboy.mvc.model.dao;

import java.util.List;

import com.codeboy.mvc.model.dto.QuizRoom;
import com.codeboy.mvc.model.dto.QuizRoomMember;
import com.codeboy.mvc.model.dto.response.GetQuizRoomMembersResponse;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QuizRoomDao {
	//quiz_room 테이블. 퀴즈룸 생성. 생성된 퀴즈룸 id 반환
	public void insertQuizRoom(QuizRoom room);

	//quiz_room_member 테이블에 값 넣기 (퀴즈방 입장) - 참가자/호스트
	public int insertMemberToQuizRoom(QuizRoomMember quizRoomMember);
	//모든 퀴즈룸 조회하기
	public List<QuizRoom> selectAllQuizRoom();

	//하나의 퀴즈룸 조회(참가 멤버확인)
	public List<GetQuizRoomMembersResponse> selectOneQuizRoom(Long roomId);

	//퀴즈룸 수정
	//퀴즈룸 삭제
    //TODO : 지금은 멤버가 전체 퀴즈방 테이블에 중복으로 들어가면 에러 터짐
    //TODO : 채팅방이 끝나면 바로 삭제하는 로직 만들어야 함.

	public boolean deleteQuizRoom(Long roomId);

    //퀴즈룸 존재하는지 확인
    public int existsQuizRoom(Long roomId);

    //퀴즈룸에 특정 멤버가 있는지 확인
    public int isDuplicatedMember(Long memberId);
}
