package com.codeboy.mvc.model.dto.request;

    import io.swagger.v3.oas.annotations.media.Schema;
    import lombok.AllArgsConstructor;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(description="유저 정보 수정 DTO")
public class MemberUpdateRequest {
    private String nickname;
    private String id;
    private String email;
}
