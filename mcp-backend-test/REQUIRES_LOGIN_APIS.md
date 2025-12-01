# 로그인이 필요한 API 목록

**세션 인증 필요**: `HttpSession`에서 `member_id` 속성을 확인하는 API들

---

## 📋 로그인이 필요한 API 목록

### 1. UserProblemSetController (3개)

#### ✅ 내 문제세트 조회
- **메서드**: `GET`
- **URL**: `/api/user-problem-sets/me`
- **설명**: 현재 로그인한 사용자의 문제세트 조회
- **세션 검증**: `session.getAttribute("member_id")`
- **에러**: 401 UNAUTHORIZED - "로그인이 필요합니다."

#### ✅ 문제세트 생성
- **메서드**: `POST`
- **URL**: `/api/user-problem-sets`
- **설명**: 새로운 문제세트 생성
- **세션 검증**: `session.getAttribute("member_id")`
- **에러**: 401 UNAUTHORIZED - "로그인이 필요합니다."

#### ✅ 문제세트 삭제
- **메서드**: `DELETE`
- **URL**: `/api/user-problem-sets/{userProblemSetId}`
- **설명**: 문제세트 삭제
- **세션 검증**: `session.getAttribute("member_id")`
- **에러**: 401 UNAUTHORIZED - "로그인이 필요합니다."

---

### 2. UserProblemController (3개)

#### ✅ 문제 일괄 등록
- **메서드**: `POST`
- **URL**: `/api/user-problems/sets/{userProblemSetId}`
- **설명**: 문제세트에 여러 문제를 일괄 등록
- **세션 검증**: `session.getAttribute("member_id")`
- **에러**: 401 UNAUTHORIZED - "로그인이 필요합니다."

#### ✅ 문제 수정
- **메서드**: `PUT`
- **URL**: `/api/user-problems/{userProblemId}`
- **설명**: 문제 정보 수정
- **세션 검증**: `session.getAttribute("member_id")`
- **에러**: 401 UNAUTHORIZED - "로그인이 필요합니다."

#### ✅ 문제 삭제
- **메서드**: `DELETE`
- **URL**: `/api/user-problems/{userProblemId}`
- **설명**: 문제 삭제
- **세션 검증**: `session.getAttribute("member_id")`
- **에러**: 401 UNAUTHORIZED - "로그인이 필요합니다."

---

### 3. CommentController (2개)

#### ✅ 댓글 수정
- **메서드**: `PATCH`
- **URL**: `/api/comments/{userProblemSetId}/{commentId}`
- **설명**: 댓글 내용 수정
- **세션 검증**: `session.getAttribute("member_id")`
- **추가 검증**: 본인이 작성한 댓글인지 확인 (`memberId.equals(commentUpdateRequest.getMemberId())`)
- **에러**: 
  - 401 UNAUTHORIZED - "로그인이 필요합니다."
  - 403 FORBIDDEN - "본인의 댓글만 수정할 수 있습니다."

#### ✅ 댓글 삭제
- **메서드**: `DELETE`
- **URL**: `/api/comments/{userProblemSetId}/{commentId}`
- **설명**: 댓글 삭제
- **세션 검증**: `session.getAttribute("member_id")`
- **추가 검증**: 본인이 작성한 댓글인지 확인 (DB에서 댓글 작성자 ID 조회 후 비교)
- **에러**: 
  - 401 UNAUTHORIZED - "로그인이 필요합니다."
  - 403 FORBIDDEN - "본인이 작성한 댓글만 삭제할 수 있습니다."

---

## 📊 요약

### 총 로그인 필요 API: **8개**

| 컨트롤러 | API 개수 | API 목록 |
|---------|---------|---------|
| **UserProblemSetController** | 3개 | 내 문제세트 조회, 문제세트 생성, 문제세트 삭제 |
| **UserProblemController** | 3개 | 문제 일괄 등록, 문제 수정, 문제 삭제 |
| **CommentController** | 2개 | 댓글 수정, 댓글 삭제 |

---

## 🔍 세션 인증 방식

모든 로그인이 필요한 API는 다음 방식으로 인증을 확인합니다:

```java
HttpSession session = ...;
Long memberId = (Long) session.getAttribute("member_id");
if (memberId == null) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ApiResponse.failure(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
}
```

### 세션 속성
- **속성명**: `member_id`
- **타입**: `Long`
- **설정 위치**: 로그인 성공 시 세션에 저장 (현재 로그인 API는 null 반환)

---

## ✅ 로그인 불필요한 API 목록

다음 API들은 세션 인증 없이 호출 가능합니다:

### MemberController
- `POST /api/member` - 회원가입
- `POST /api/check-id` - ID 중복체크
- `POST /api/check-email` - 이메일 중복체크
- `POST /api/check-nickname` - 닉네임 중복체크
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### ProblemController
- `GET /api/problem` - 문제 조회

### QuizRoomController
- `POST /api/quiz-room/create/{memberId}` - 퀴즈방 생성 (PathVariable로 memberId 전달)
- `POST /api/quiz-room/join` - 퀴즈방 참여
- `GET /api/quiz-room` - 퀴즈방 목록 조회
- `GET /api/quiz-room/{roomId}/member` - 퀴즈방 멤버 조회
- `DELETE /api/quiz-room/{roomId}` - 퀴즈방 삭제

### UserProblemSetController
- `GET /api/user-problem-sets` - 모든 문제세트 조회

### UserProblemController
- `GET /api/user-problems/sets/{userProblemSetId}` - 문제세트의 문제들 조회

### CommentController
- `GET /api/comments/{userProblemSetId}` - 댓글 조회
- `POST /api/comments/{userProblemSetId}` - 댓글 추가 (세션 불필요하지만 memberId는 RequestBody에 포함)

### IncorrectNoteController
- `GET /api/incorrect-note` - 오답노트 조회
- `POST /api/incorrect-note` - 오답노트 추가
- `DELETE /api/incorrect-note/{incorrectNoteId}` - 오답노트 삭제

---

## 💡 테스트 시 주의사항

1. **세션 관리**: 로그인 후 세션 쿠키를 유지해야 합니다.
2. **axios 설정**: `withCredentials: true` 옵션 필요
3. **쿠키 저장**: 세션 쿠키를 저장하고 재사용해야 합니다.

### 예시 코드
```typescript
import axios from "axios";

const client = axios.create({
  withCredentials: true, // 쿠키 포함
});

// 로그인 후 세션 설정
await client.post("/api/auth/login", { id: "user1", password: "pass" });

// 이후 로그인이 필요한 API 호출 가능
await client.get("/api/user-problem-sets/me");
```

---

## 📝 참고사항

- 현재 로그인 API(`POST /api/auth/login`)는 null을 반환하므로 실제 구현이 필요합니다.
- 세션에 `member_id`를 저장하는 로직이 구현되어야 합니다.
- 일부 API는 추가 권한 검증이 있습니다 (예: 본인 댓글만 수정/삭제 가능).


