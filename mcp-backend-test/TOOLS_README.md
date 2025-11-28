# MCP Backend Test Tools

이 프로젝트는 Spring Boot 백엔드 API를 MCP(Model Context Protocol) 툴로 자동 생성한 것입니다.

## 📁 프로젝트 구조

```
mcp-backend-test/
├── server.ts                 # MCP 서버 메인 파일
└── tools/                    # API 툴들이 분리된 폴더
    ├── index.ts              # 모든 툴 export
    ├── commentTools.ts       # Comment API 툴들
    ├── userProblemTools.ts   # UserProblem API 툴들
    └── userProblemSetTools.ts # UserProblemSet API 툴들
```

## 🔧 생성된 MCP 툴 목록

### Comment API (4개)

1. **comment_get_all_by_set**

   - 특정 문제세트의 모든 댓글 조회
   - 파라미터: `userProblemSetId` (number)

2. **comment_add**

   - 댓글 추가
   - 파라미터:
     - `userProblemSetId` (number)
     - `comment` (object):
       - `memberId` (number)
       - `content` (string)

3. **comment_update**

   - 댓글 수정
   - 파라미터:
     - `userProblemSetId` (number)
     - `commentId` (number)
     - `updateRequest` (object):
       - `content` (string)
       - `memberId` (number)

4. **comment_delete**
   - 댓글 삭제
   - 파라미터:
     - `userProblemSetId` (number)
     - `commentId` (number)

### UserProblem API (4개)

1. **user_problem_get_by_set**

   - 특정 문제세트의 모든 문제 조회
   - 파라미터: `userProblemSetId` (number)

2. **user_problem_create_bulk**

   - 문제 일괄 등록
   - 파라미터:
     - `userProblemSetId` (number)
     - `userProblems` (array of objects):
       - `problemDescription` (string)
       - `category` (string)
       - `choice1` (string)
       - `choice2` (string)
       - `choice3` (string)
       - `choice4` (string)
       - `answer` (string)

3. **user_problem_update**

   - 문제 수정
   - 파라미터:
     - `userProblemId` (number)
     - `userProblem` (object): (위와 동일한 필드)

4. **user_problem_delete**
   - 문제 삭제
   - 파라미터: `userProblemId` (number)

### UserProblemSet API (4개)

1. **user_problem_set_get_all**

   - 모든 문제세트 조회
   - 파라미터: 없음

2. **user_problem_set_get_my**

   - 내가 만든 문제세트 조회
   - 파라미터: 없음

3. **user_problem_set_create**

   - 문제세트 생성
   - 파라미터: 없음

4. **user_problem_set_delete**
   - 문제세트 삭제
   - 파라미터: `userProblemSetId` (number)

## 🚀 실행 방법

```bash
# 의존성 설치
cd mcp-backend-test
npm install

# MCP 서버 실행
npx tsx server.ts
```

## 📝 주요 특징

- ✅ **자동 생성**: Java Controller 파일을 분석하여 자동으로 MCP 툴 생성
- ✅ **모듈화**: API별로 파일을 분리하여 유지보수 용이
- ✅ **타입 안전**: Zod를 사용한 파라미터 검증
- ✅ **에러 핸들링**: 상세한 에러 메시지 제공
- ✅ **DTO 기반**: CommentUpdateRequest, ApiResponse 등 백엔드 DTO 구조 반영

## 🔗 백엔드 연동

- Base URL: `http://localhost:8080`
- 모든 API는 백엔드의 REST API를 axios로 호출합니다
- 응답은 `{ status, body }` 형태로 반환됩니다

## 📌 기존 툴

기존에 있던 툴들도 그대로 유지됩니다:

- `login`: 백엔드 로그인 API 호출
- `call_backend_api`: 범용 백엔드 API 호출
- `run_sql_query`: MySQL 직접 쿼리 실행

