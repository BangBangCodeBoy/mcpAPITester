package com.codeboy.mvc.model.dto;

import java.sql.Timestamp;

import com.codeboy.common.Status;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Schema(description="회원 DTO")
public class Member {
    private long memberId;
    private String id;
    private String password;
    private String nickname;
    private String email;
    private Timestamp signupDate;
    private Boolean isActive;
    private Timestamp deletedDate;
	
	
    

}
