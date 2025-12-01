package com.codeboy.mvc.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class LoginRequest {
	//로그인을 할 때에는 id와 password만 사용하니 이를 간편하게 전달하기 위한 DTO
    private String id;
    private String password;

}
