# MCP Backend Test - API & SQL 통합 시스템

Spring Boot 백엔드 API를 분석하여 자동 생성된 MCP 툴 시스템입니다.
API 호출 시 매칭되는 SQL 쿼리가 자동으로 실행됩니다.

## 📁 프로젝트 구조

```
mcp-backend-test/
├── server.ts                           # MCP 서버 메인 파일
├── tools/                              # API 툴들
│   ├── index.ts                        # 통합 export
│   ├── commentTools.ts                 # Comment API만 호출
│   ├── userProblemTools.ts             # UserProblem API만 호출
│   ├── userProblemSetTools.ts          # UserProblemSet API만 호출
│   ├── commentToolsWithSql.ts          # Comment API + SQL 자동 실행
│   ├── userProblemToolsWithSql.ts      # UserProblem API + SQL 자동 실행
│   └── userProblemSetToolsWithSql.ts   # UserProblemSet API + SQL 자동 실행
└── sqlTools/                           # SQL 툴들
    ├── index.ts                        # 통합 export
    ├── apiSqlMapper.ts                 # API-SQL 매핑 시스템
    ├── commentSqlTools.ts              # Comment SQL 직접 실행
    ├── userProblemSqlTools.ts          # UserProblem SQL 직접 실행
    └── userProblemSetSqlTools.ts       # UserProblemSet SQL 직접 실행
```

## 🎯 핵심 기능

### 1. API 전용 툴 (12개)
API만 호출하는 툴들:
- `comment_get_all_by_set` / `comment_add` / `comment_update` / `comment_delete`
- `user_problem_get_by_set` / `user_problem_create_bulk` / `user_problem_update` / `user_problem_delete`
- `user_problem_set_get_all` / `user_problem_set_get_my` / `user_problem_set_create` / `user_problem_set_delete`

### 2. API + SQL 통합 툴 (12개) ⭐
API 호출 + 매칭되는 SQL을 자동으로 실행하는 툴들:
- `comment_get_all_by_set_with_sql` / `comment_add_with_sql` / `comment_update_with_sql` / `comment_delete_with_sql`
- `user_problem_get_by_set_with_sql` / `user_problem_create_bulk_with_sql` / `user_problem_update_with_sql` / `user_problem_delete_with_sql`
- `user_problem_set_get_all_with_sql` / `user_problem_set_get_my_with_sql` / `user_problem_set_create_with_sql` / `user_problem_set_delete_with_sql`

### 3. SQL 전용 툴 (13개)
SQL만 직접 실행하는 툴들:
- Comment: `sql_select_comments_by_set` / `sql_insert_comment` / `sql_update_comment` / `sql_delete_comment` / `sql_select_comment_owner`
- UserProblem: `sql_select_problems_by_set` / `sql_insert_user_problems` / `sql_update_user_problem` / `sql_delete_user_problem`
- UserProblemSet: `sql_select_all_problem_sets` / `sql_select_problem_set_by_member` / `sql_insert_problem_set` / `sql_delete_problem_set`

## 🔍 API-SQL 매핑 시스템

### 작동 원리

```
API 호출 → Controller → Service → Dao → Mapper.xml → SQL 실행
```

`apiSqlMapper.ts`가 이 전체 흐름을 추적하여 자동으로 매칭합니다.

### 매핑 예시

#### Comment API

| API Tool | Controller Method | Service Method | Dao Method | Mapper.xml ID | SQL |
|----------|------------------|----------------|------------|---------------|-----|
| `comment_get_all_by_set_with_sql` | `getAllCommentsById()` | `getAllCommentsById()` | `selectCommentsByuserProblemSetId()` | `selectAllByUserProblemSetId` | `SELECT * FROM comment WHERE user_problem_set_id = ?` |
| `comment_add_with_sql` | `addComment()` | `addComment()` | `insertComment()` | `insertComment` | `INSERT INTO comment (...)` |
| `comment_update_with_sql` | `updateComment()` | `updateComment()` | `updateComment()` | `updateComment` | `UPDATE comment SET content = ? WHERE comment_id = ?` |
| `comment_delete_with_sql` | `deleteComment()` | `deleteComment()` / `getCommentOwnerId()` | `deleteComment()` / `selectCommentOwnerId()` | `deleteComment` | 2개의 쿼리 실행 |

#### UserProblem API

| API Tool | Dao Method | SQL |
|----------|------------|-----|
| `user_problem_get_by_set_with_sql` | `selectProblemsByUserProblemSetId()` | `SELECT * FROM user_problem WHERE user_problem_set_id = ?` |
| `user_problem_create_bulk_with_sql` | `insertUserProblemList()` | `INSERT INTO user_problem (...) VALUES ?` (일괄 등록) |
| `user_problem_update_with_sql` | `updateUserProblem()` | `UPDATE user_problem SET ... WHERE user_problem_id = ?` |
| `user_problem_delete_with_sql` | `deleteUserProblemById()` | `DELETE FROM user_problem WHERE user_problem_id = ?` |

#### UserProblemSet API

| API Tool | Dao Method | SQL |
|----------|------------|-----|
| `user_problem_set_get_all_with_sql` | `selectUserProblemSets()` | `SELECT * FROM user_problem_set` |
| `user_problem_set_get_my_with_sql` | `selectUserProblemSetByMemberId()` | `SELECT * FROM user_problem_set WHERE member_id = ?` |
| `user_problem_set_create_with_sql` | `insertUserProblemSet()` | `INSERT INTO user_problem_set (member_id) VALUES (?)` |
| `user_problem_set_delete_with_sql` | `deleteUserProblemSetById()` | `DELETE FROM user_problem_set WHERE user_problem_set_id = ?` |

## 📊 응답 형식

### API + SQL 통합 툴 응답 예시

```json
{
  "api": {
    "endpoint": "GET /api/comments/1",
    "status": 200,
    "response": {
      "status": "OK",
      "message": "댓글 조회 성공",
      "data": [...]
    }
  },
  "sql": {
    "apiName": "comment_get_all_by_set",
    "sqlQueries": [
      {
        "query": "selectCommentsByuserProblemSetId",
        "sql": "SELECT * FROM comment WHERE user_problem_set_id = ?",
        "params": { "userProblemSetId": 1 },
        "result": [...]
      }
    ]
  }
}
```

## 🚀 사용 방법

### 1. MCP 서버 실행

```bash
cd mcp-backend-test
npx tsx server.ts
```

### 2. 툴 사용 예시

#### API + SQL 통합 툴 사용 (권장)

```typescript
// 댓글 조회 (API + SQL)
comment_get_all_by_set_with_sql({
  userProblemSetId: 1
})

// 결과: API 응답 + SQL 쿼리 결과 모두 반환
```

#### API만 호출

```typescript
comment_get_all_by_set({
  userProblemSetId: 1
})
```

#### SQL만 실행

```typescript
sql_select_comments_by_set({
  userProblemSetId: 1
})
```

## 🔧 기술 스택

- **MCP SDK**: @modelcontextprotocol/sdk ^1.23.0
- **HTTP Client**: axios ^1.13.2
- **Database**: mysql2 ^3.15.3
- **Validation**: zod ^4.1.13
- **Runtime**: tsx ^4.20.6

## 📝 코드 분석 기반

이 시스템은 다음 파일들을 분석하여 자동 생성되었습니다:

### Controller
- CommentController.java
- UserProblemController.java
- UserProblemSetController.java

### Service Layer
- CommentService.java / CommentServiceImpl.java
- UserProblemService.java / UserProblemServiceImpl.java
- UserProblemSetService.java / UserProblemSetServiceImpl.java

### DAO Layer
- CommentDao.java
- UserProblemDao.java
- UserProblemSetDao.java

### MyBatis Mapper
- CommentMapper.xml
- UserProblemMapper.xml
- UserProblemSetMapper.xml

### DTO
- Comment.java
- UserProblem.java
- UserProblemSet.java
- CommentUpdateRequest.java
- ApiResponse.java

## 💡 특징

1. **완벽한 매핑**: Controller → Service → Dao → Mapper.xml → SQL 전체 흐름 추적
2. **자동 파라미터 변환**: API 파라미터를 SQL 파라미터로 자동 변환
3. **복합 쿼리 지원**: `comment_delete`처럼 여러 SQL이 실행되는 경우도 모두 추적
4. **타입 안전**: Zod 스키마로 모든 파라미터 검증
5. **에러 핸들링**: API 에러와 SQL 에러를 모두 상세히 표시

## 🎁 기존 툴 유지

기존에 있던 툴들도 그대로 유지됩니다:
- `login`: 백엔드 로그인 API 호출
- `call_backend_api`: 범용 백엔드 API 호출
- `run_sql_query`: MySQL 직접 쿼리 실행

## 📈 전체 통계

- **총 툴 개수**: 40개
  - API 전용: 12개
  - API + SQL 통합: 12개
  - SQL 전용: 13개
  - 기존 툴: 3개
- **지원 API 엔드포인트**: 12개
- **지원 SQL 쿼리**: 13개


