package com.codeboy.mvc.model.service;

import com.codeboy.mvc.model.dto.Member;
import com.codeboy.mvc.model.dto.request.MemberUpdateRequest;

public interface MemberService {

    // 회원정보 조회
    Member getMemberById(Long memberId);

    // 회원 탈퇴
    void deactivateMember(Long memberId);

    // 회원 정보 수정
    void updateMember(Long memberId, MemberUpdateRequest memberUpdateRequest);

    // 중복검사 (ID)
    boolean checkIdDuplicate(String id);

    // 중복검사 (Nickname)
    boolean checkNicknameDuplicate(String nickname);

    // 중복검사 (Email)
    boolean checkEmailDuplicate(String email);

    int signUp(Member member);
    
    
    // 로그인
    Member login(String id, String password);
}
