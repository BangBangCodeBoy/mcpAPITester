package com.codeboy.mvc.model.dao;

import com.codeboy.mvc.model.dto.Member;
import com.codeboy.mvc.model.dto.request.MemberUpdateRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
@Mapper
public interface MemberDao {
    int insertMember(Member member);

    Member selectMemberById(Long memberId);

    //멤버 삭제 -> db에서는 status 변경
    int deactivateMemberById(Long memberId);

    //멤버 업데이트 -> db에서는 patch(nickname, email, id)
    int updateMemberById(@Param("memberId") Long memberId, @Param("update") MemberUpdateRequest memberUpdateRequest);

    //아이디 중복 체크
    Boolean existsId(String id);

    //닉네임 중복 체크
    Boolean existsNickname(String nickname);

    //이메일 중복 체크
    Boolean existsEmail(String email);

    //멤버가 활성화 상태인지 확인
    Boolean isMemberActive(Long memberId);

    // 회원 비활성화(탈퇴) - status, isDeleted 업데이트
    int deleteMember(long memberId);
    
    // 로그인 - ID와 password로 회원 조회
    Member selectMemberByIdAndPassword(@Param("id") String id, @Param("password") String password);
    
    
}
