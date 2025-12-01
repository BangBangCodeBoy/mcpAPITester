# testuser_signup으로 로그인 후 전체 API 테스트 결과

**테스트 일시**: 2025-11-29  
**백엔드 URL**: `http://localhost:8080`  
**로그인 계정**: testuser_signup / testpass123

---

## 📊 테스트 결과 요약

### 통계
- **총 테스트**: 19개
- **✅ 성공**: 12개 (63.2%)
- **❌ 실패**: 7개 (36.8%)

---

## ✅ 성공한 API (12개)

### MemberController
1. ✅ **회원 조회** - `GET /api/members/` (200)
2. ✅ **ID 중복체크** - `POST /api/check-id` (200)
3. ✅ **이메일 중복체크** - `POST /api/check-email` (200)
4. ✅ **닉네임 중복체크** - `POST /api/check-nickname` (200)
5. ✅ **로그아웃** - `POST /api/auth/logout` (200)

### ProblemController
6. ✅ **문제 조회** - `GET /api/problem?limit=1&category=INFOENGINEERING` (200)

### QuizRoomController
7. ✅ **퀴즈방 목록 조회** - `GET /api/quiz-room` (200)

### UserProblemSetController
8. ✅ **모든 문제세트 조회** - `GET /api/user-problem-sets` (200)

### CommentController
9. ✅ **댓글 조회** - `GET /api/comments/1` (200)

### IncorrectNoteController
10. ✅ **오답노트 조회** - `GET /api/incorrect-note` (200)
11. ✅ **오답노트 추가** - `POST /api/incorrect-note` (201)
12. ✅ **오답노트 삭제** - `DELETE /api/incorrect-note/7` (200)

---

## ❌ 실패한 API (7개)

### 1. 로그인 실패 (가장 중요) ⚠️
- **URL**: `POST /api/auth/login`
- **상태**: 500
- **원인**: 서버 내부 오류
- **영향**: 로그인 실패로 인해 세션이 필요한 모든 API 실패

**해결 필요**: 
- MemberMapper.xml의 로그인 쿼리 확인 (`is_active = 1`로 수정 완료)
- 서버 재시작 필요
- DB에서 testuser_signup의 `is_active` 값 확인

### 2. 세션 필요 API들 (로그인 실패로 인한 연쇄 실패)
- `GET /api/user-problem-sets/me` → 401 (로그인 필요)
- `POST /api/user-problem-sets` → 401 (로그인 필요)
- `POST /api/user-problems/sets/1` → 401 (로그인 필요)

**해결책**: 로그인 문제 해결 후 재테스트

### 3. 댓글 추가 실패
- **URL**: `POST /api/comments/1`
- **상태**: 500
- **원인**: `NullPointerException` - 세션에서 `member_id`를 가져올 수 없음
- **해결**: 로그인 성공 후 세션이 설정되면 해결될 것으로 예상

### 4. 정상 동작 (데이터 없음)
- `GET /api/user-problems/sets/1` → 404 (문제세트에 문제가 없음)

### 5. 회원 정보 업데이트
- **URL**: `PATCH /api`
- **상태**: 400
- **원인**: 중복된 ID (정상 동작)

---

## 🔧 수정한 내용

### 1. MemberMapper.xml
- ✅ 로그인 쿼리: `status = 'ACTIVE'` → `is_active = 1`
- ✅ 회원가입 쿼리: `TRUE` → `1` (일관성 유지)

### 2. CommentController.java
- ✅ `addComment`: `session.getAttribute("memberId")` → `session.getAttribute("member_id")`
- ✅ `addComment`: 세션 null 체크 추가
- ✅ `updateComment`: `session.getAttribute("memberId")` → `session.getAttribute("member_id")`

### 3. UserProblemSetController.java
- ✅ `getMyUserProblemSet`: `session.getAttribute("membeId")` → `session.getAttribute("member_id")` (오타 수정)
- ✅ `createMyUserProblemSet`: `session.getAttribute("memberId")` → `session.getAttribute("member_id")`

### 4. UserProblemController.java
- ✅ 모든 메서드: `session.getAttribute("memberId")` → `session.getAttribute("member_id")`

---

## 💡 다음 단계

### 1. 서버 재시작 (필수)
- MemberMapper.xml 변경사항 반영을 위해 서버 재시작 필요

### 2. 로그인 재테스트
- 서버 재시작 후 testuser_signup/testpass123으로 로그인 재시도

### 3. 로그인 성공 후 전체 API 재테스트
- 세션이 필요한 모든 API 재테스트
- 댓글 추가/수정/삭제 테스트
- 문제세트 생성 및 문제 등록 테스트

### 4. DB 확인
- testuser_signup의 `is_active` 값이 1인지 확인
- password가 정확히 일치하는지 확인

---

## 📋 테스트한 모든 URL 목록

### MemberController (`/api`)
1. ❌ `POST /api/auth/login` - 로그인
2. ✅ `GET /api/members/` - 회원 조회
3. ✅ `POST /api/check-id` - ID 중복체크
4. ✅ `POST /api/check-email` - 이메일 중복체크
5. ✅ `POST /api/check-nickname` - 닉네임 중복체크
6. ❌ `PATCH /api` - 회원 정보 업데이트 (중복 ID)
7. ✅ `POST /api/auth/logout` - 로그아웃

### ProblemController (`/api/problem`)
8. ✅ `GET /api/problem?limit=1&category=INFOENGINEERING` - 문제 조회

### QuizRoomController (`/api/quiz-room`)
9. ✅ `GET /api/quiz-room` - 퀴즈방 목록 조회

### UserProblemSetController (`/api/user-problem-sets`)
10. ✅ `GET /api/user-problem-sets` - 모든 문제세트 조회
11. ❌ `GET /api/user-problem-sets/me` - 내 문제세트 조회 (로그인 필요)
12. ❌ `POST /api/user-problem-sets` - 문제세트 생성 (로그인 필요)

### UserProblemController (`/api/user-problems`)
13. ❌ `GET /api/user-problems/sets/1` - 문제 조회 (데이터 없음)
14. ❌ `POST /api/user-problems/sets/1` - 문제 일괄 등록 (로그인 필요)

### CommentController (`/api/comments`)
15. ✅ `GET /api/comments/1` - 댓글 조회
16. ❌ `POST /api/comments/1` - 댓글 추가 (세션 없음)

### IncorrectNoteController (`/api/incorrect-note`)
17. ✅ `GET /api/incorrect-note` - 오답노트 조회
18. ✅ `POST /api/incorrect-note` - 오답노트 추가
19. ✅ `DELETE /api/incorrect-note/7` - 오답노트 삭제

---

## 🎯 결론

### 현재 상태
- **성공률**: 63.2% (12/19)
- **주요 성과**: 로그인 없이 동작하는 API들은 대부분 정상 동작
- **주요 문제**: 로그인 실패로 인한 세션 필요 API 연쇄 실패

### 수정 완료
- ✅ 세션 속성명 통일 (`member_id`)
- ✅ CommentController 세션 null 체크 추가
- ✅ MemberMapper.xml 로그인 쿼리 수정

### 해결 필요
1. **로그인 문제** (최우선) - 서버 재시작 후 재테스트 필요
2. **로그인 성공 후 세션 필요 API 재테스트**

---

**참고**: 상세한 테스트 결과는 `test-with-signup-user-results.txt` 파일을 참고하세요.


