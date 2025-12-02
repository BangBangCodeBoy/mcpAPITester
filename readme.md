# 테스트 시나리오 결과 보고서

**테스트 일시**: 2025-12-02 16:56

**총 테스트**: 26개
**✅ 성공**: 22개
**❌ 실패**: 4개
**성공률**: 84.6%

---

웹 프론트엔드 환경에서 html페이지에서 요청을 보내면 vite프록시(localhost:5500)으로 요청을 보냄. 로그인 form을 통해 로그인하여 테스트함.
로그인은
ID: 2
password:1234로 실행

자세한 테스트 실행 순서는 testScenario.md 참고

## ✅ 성공한 테스트

### [4] 문제세트 전체조회

-   **Method**: GET
-   **URL**: /api/user-problem-sets
-   **Status**: 200
-   **응답**: ```json
    {
    "status": "OK",
    "message": "유저 문제세트 전체 조회 성공",
    "data": [
    {
    "userProblemSetId": 1,
    "memberId": 1
    },
    {
    "userProblemSetId": 2,
    "memberId": 1
    },
    {
    "userProblemSetId": 3,
    "memberId": 1
    },
    {
    "userProblemSetId": 14,
    "memberId": 1
    },
    {
    "userProblemSetId": 15,
    "memberId": 2
    },
    {
    "userProblemSetId": 16,
    "memberId": 3
    },
    {
    "userProblemSetId": 17,
    "memberId": 4
    },
    {
    "userProblemSetId": 18,
    "memberId": 5
    },
    {
    "userProblemSetId": 4,
    "memberId": 10
    },
    {
    "userProblemSetId": 5,
    "memberId": 10
    },
    {
    "userProblemSetId": 6,
    "memberId": 10
    },
    {
    "userProblemSetId": 7,
    "memberId": 10
    },
    {
    "userProblemSetId": 8,
    "memberId": 10
    },
    {
    "userProblemSetId": 9,
    "memberId": 10
    },
    {
    "userProblemSetId": 10,
    "memberId": 10
    },
    {
    "userProblemSetId": 11,
    "memberId": 10
    },
    {
    "userProblemSetId": 12,
    "memberId": 10
    },
    {
    "userProblemSetId": 19,
    "memberId": 23
    },
    {
    "userProblemSetId": 20,
    "memberId": 24
    },
    {
    "userProblemSetId": 21,
    "memberId": 24
    },
    {
    "userProblemSetId": 22,
    "memberId": 24
    },
    {
    "userProblemSetId": 23,
    "memberId": 24
    },
    {
    "userProblemSetId": 24,
    "memberId": 24
    },
    {
    "userProblemSetId": 25,
    "memberId": 24
    },
    {
    "userProblemSetId": 26,
    "memberId": 24
    },
    {
    "userProblemSetId": 27,
    "memberId": 24
    },
    {
    "userProblemSetId": 28,
    "memberId": 24
    },
    {
    "userProblemSetId": 29,
    "memberId": 24
    },
    {
    "userProblemSetId": 30,
    "memberId": 26
    },
    {
    "userProblemSetId": 31,
    "memberId": 27
    },
    {
    "userProblemSetId": 32,
    "memberId": 28
    },
    {
    "userProblemSetId": 33,
    "memberId": 29
    }
    ]
    }

````

### [5] 내 문제세트 조회
- **Method**: GET
- **URL**: /api/user-problem-sets/me
- **Status**: 200
- **응답**: ```json
{
  "status": "OK",
  "message": "나의 유저 문제세트 조회 성공",
  "data": {
    "userProblemSetId": 19,
    "memberId": 23
  }
}
````

### [6] 문제 일괄 등록

-   **Method**: POST
-   **URL**: /api/user-problems/sets/19
-   **Status**: 201
-   **응답**: ```json
    {
    "status": "CREATED",
    "message": "문제 등록 성공",
    "data": null
    }

````

### [6] 문제 목록 조회
- **Method**: GET
- **URL**: /api/user-problems/sets/19
- **Status**: 200
- **응답**: ```json
{
  "status": "OK",
  "message": "문제 목록 조회 성공",
  "data": [
    {
      "userProblemId": 18,
      "problemDescription": "수정된 문제입니다!",
      "category": "INFOENGINEERING",
      "choice1": "수정1",
      "choice2": "수정2",
      "choice3": "수정3",
      "choice4": "수정4",
      "answer": "2",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 21,
      "problemDescription": "수정된 문제입니다!",
      "category": "INFOENGINEERING",
      "choice1": "수정된선택지1",
      "choice2": "수정된선택지2",
      "choice3": "수정된선택지3",
      "choice4": "수정된선택지4",
      "answer": "2",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 22,
      "problemDescription": "id:2로 로그인 후 테스트 문제 2",
      "category": "INFOENGINEERING",
      "choice1": "선택지A",
      "choice2": "선택지B",
      "choice3": "선택지C",
      "choice4": "선택지D",
      "answer": "2",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 23,
      "problemDescription": "id:2로 로그인 후 테스트 문제 3",
      "category": "SQLD",
      "choice1": "선택지가",
      "choice2": "선택지나",
      "choice3": "선택지다",
      "choice4": "선택지라",
      "answer": "3",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 24,
      "problemDescription": "전체 API 테스트 문제 1",
      "category": "INFOENGINEERING",
      "choice1": "선택지1",
      "choice2": "선택지2",
      "choice3": "선택지3",
      "choice4": "선택지4",
      "answer": "1",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 25,
      "problemDescription": "전체 API 테스트 문제 2",
      "category": "INFOENGINEERING",
      "choice1": "선택지A",
      "choice2": "선택지B",
      "choice3": "선택지C",
      "choice4": "선택지D",
      "answer": "2",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 28,
      "problemDescription": "전체 API 테스트 문제 1",
      "category": "INFOENGINEERING",
      "choice1": "선택지1",
      "choice2": "선택지2",
      "choice3": "선택지3",
      "choice4": "선택지4",
      "answer": "1",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 29,
      "problemDescription": "전체 API 테스트 문제 2",
      "category": "INFOENGINEERING",
      "choice1": "선택지A",
      "choice2": "선택지B",
      "choice3": "선택지C",
      "choice4": "선택지D",
      "answer": "2",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 42,
      "problemDescription": "시나리오 테스트 문제 1",
      "category": "INFOENGINEERING",
      "choice1": "선택지1",
      "choice2": "선택지2",
      "choice3": "선택지3",
      "choice4": "선택지4",
      "answer": "1",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 43,
      "problemDescription": "시나리오 테스트 문제 2",
      "category": "INFOENGINEERING",
      "choice1": "선택지A",
      "choice2": "선택지B",
      "choice3": "선택지C",
      "choice4": "선택지D",
      "answer": "2",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 44,
      "problemDescription": "시나리오 테스트 문제 3",
      "category": "SQLD",
      "choice1": "옵션1",
      "choice2": "옵션2",
      "choice3": "옵션3",
      "choice4": "옵션4",
      "answer": "3",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 45,
      "problemDescription": "시나리오 테스트 문제 1",
      "category": "INFOENGINEERING",
      "choice1": "선택지1",
      "choice2": "선택지2",
      "choice3": "선택지3",
      "choice4": "선택지4",
      "answer": "1",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 46,
      "problemDescription": "시나리오 테스트 문제 2",
      "category": "INFOENGINEERING",
      "choice1": "선택지A",
      "choice2": "선택지B",
      "choice3": "선택지C",
      "choice4": "선택지D",
      "answer": "2",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 47,
      "problemDescription": "시나리오 테스트 문제 3",
      "category": "SQLD",
      "choice1": "옵션1",
      "choice2": "옵션2",
      "choice3": "옵션3",
      "choice4": "옵션4",
      "answer": "3",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 48,
      "problemDescription": "시나리오 테스트 문제 1",
      "category": "INFOENGINEERING",
      "choice1": "선택지1",
      "choice2": "선택지2",
      "choice3": "선택지3",
      "choice4": "선택지4",
      "answer": "1",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 49,
      "problemDescription": "시나리오 테스트 문제 2",
      "category": "INFOENGINEERING",
      "choice1": "선택지A",
      "choice2": "선택지B",
      "choice3": "선택지C",
      "choice4": "선택지D",
      "answer": "2",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 50,
      "problemDescription": "시나리오 테스트 문제 3",
      "category": "SQLD",
      "choice1": "옵션1",
      "choice2": "옵션2",
      "choice3": "옵션3",
      "choice4": "옵션4",
      "answer": "3",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 51,
      "problemDescription": "시나리오 테스트 문제 1",
      "category": "INFOENGINEERING",
      "choice1": "선택지1",
      "choice2": "선택지2",
      "choice3": "선택지3",
      "choice4": "선택지4",
      "answer": "1",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 52,
      "problemDescription": "시나리오 테스트 문제 2",
      "category": "INFOENGINEERING",
      "choice1": "선택지A",
      "choice2": "선택지B",
      "choice3": "선택지C",
      "choice4": "선택지D",
      "answer": "2",
      "commentCount": 0,
      "userProblemSetId": 19
    },
    {
      "userProblemId": 53,
      "problemDescription": "시나리오 테스트 문제 3",
      "category": "SQLD",
      "choice1": "옵션1",
      "choice2": "옵션2",
      "choice3": "옵션3",
      "choice4": "옵션4",
      "answer": "3",
      "commentCount": 0,
      "userProblemSetId": 19
    }
  ]
}
````

### [7] 문제 수정

-   **Method**: PUT
-   **URL**: /api/user-problems/18
-   **Status**: 200
-   **응답**: ```json
    {
    "status": "OK",
    "message": "문제 수정 성공",
    "data": null
    }

````

### [8] 댓글 조회
- **Method**: GET
- **URL**: /api/comments/19
- **Status**: 200
- **응답**: ```json
{
  "status": "OK",
  "message": "댓글 조회 성공",
  "data": [
    {
      "commentId": 7,
      "memberId": 23,
      "content": "수정된 댓글 내용입니다!",
      "commentDate": "2025-11-30T13:39:32.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 13,
      "memberId": 23,
      "content": "전체 API 테스트 댓글입니다!",
      "commentDate": "2025-11-30T13:46:34.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 14,
      "memberId": 23,
      "content": "전체 API 테스트 댓글입니다!",
      "commentDate": "2025-12-02T10:46:10.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 27,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 1입니다.",
      "commentDate": "2025-12-02T16:19:55.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 28,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 2입니다.",
      "commentDate": "2025-12-02T16:19:55.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 29,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 3입니다.",
      "commentDate": "2025-12-02T16:19:55.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 30,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 1입니다.",
      "commentDate": "2025-12-02T16:33:26.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 31,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 2입니다.",
      "commentDate": "2025-12-02T16:33:26.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 32,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 3입니다.",
      "commentDate": "2025-12-02T16:33:26.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 33,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 1입니다.",
      "commentDate": "2025-12-02T16:51:40.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 34,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 2입니다.",
      "commentDate": "2025-12-02T16:51:40.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 35,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 3입니다.",
      "commentDate": "2025-12-02T16:51:40.000+00:00",
      "userProblemSetId": 19
    }
  ]
}
````

### [9] 댓글 작성 1

-   **Method**: POST
-   **URL**: /api/comments/19
-   **Status**: 201
-   **응답**: ```json
    {
    "status": "CREATED",
    "message": "댓글 추가 성공",
    "data": null
    }

````

### [9] 댓글 작성 2
- **Method**: POST
- **URL**: /api/comments/19
- **Status**: 201
- **응답**: ```json
{
  "status": "CREATED",
  "message": "댓글 추가 성공",
  "data": null
}
````

### [9] 댓글 작성 3

-   **Method**: POST
-   **URL**: /api/comments/19
-   **Status**: 201
-   **응답**: ```json
    {
    "status": "CREATED",
    "message": "댓글 추가 성공",
    "data": null
    }

````

### [9] 댓글 재조회
- **Method**: GET
- **URL**: /api/comments/19
- **Status**: 200
- **응답**: ```json
{
  "status": "OK",
  "message": "댓글 조회 성공",
  "data": [
    {
      "commentId": 7,
      "memberId": 23,
      "content": "수정된 댓글 내용입니다!",
      "commentDate": "2025-11-30T13:39:32.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 13,
      "memberId": 23,
      "content": "전체 API 테스트 댓글입니다!",
      "commentDate": "2025-11-30T13:46:34.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 14,
      "memberId": 23,
      "content": "전체 API 테스트 댓글입니다!",
      "commentDate": "2025-12-02T10:46:10.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 27,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 1입니다.",
      "commentDate": "2025-12-02T16:19:55.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 28,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 2입니다.",
      "commentDate": "2025-12-02T16:19:55.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 29,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 3입니다.",
      "commentDate": "2025-12-02T16:19:55.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 30,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 1입니다.",
      "commentDate": "2025-12-02T16:33:26.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 31,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 2입니다.",
      "commentDate": "2025-12-02T16:33:26.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 32,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 3입니다.",
      "commentDate": "2025-12-02T16:33:26.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 33,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 1입니다.",
      "commentDate": "2025-12-02T16:51:40.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 34,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 2입니다.",
      "commentDate": "2025-12-02T16:51:40.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 35,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 3입니다.",
      "commentDate": "2025-12-02T16:51:40.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 36,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 1입니다.",
      "commentDate": "2025-12-02T16:56:24.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 37,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 2입니다.",
      "commentDate": "2025-12-02T16:56:24.000+00:00",
      "userProblemSetId": 19
    },
    {
      "commentId": 38,
      "memberId": 23,
      "content": "시나리오 테스트 댓글 3입니다.",
      "commentDate": "2025-12-02T16:56:24.000+00:00",
      "userProblemSetId": 19
    }
  ]
}
````

### [11] 댓글 삭제

-   **Method**: DELETE
-   **URL**: /api/comments/19/13
-   **Status**: 200
-   **응답**: ```json
    {
    "status": "OK",
    "message": "댓글 삭제 성공",
    "data": null
    }

````

### [13] 전체 점수 조회
- **Method**: GET
- **URL**: /api/scores
- **Status**: 200
- **응답**: ```json
{
  "status": "OK",
  "message": "점수 목록 조회 성공",
  "data": [
    {
      "memberId": 1,
      "score": 14
    },
    {
      "memberId": 2,
      "score": 84
    },
    {
      "memberId": 3,
      "score": 3
    },
    {
      "memberId": 23,
      "score": 200
    },
    {
      "memberId": 27,
      "score": 200
    },
    {
      "memberId": 28,
      "score": 200
    },
    {
      "memberId": 29,
      "score": 200
    }
  ]
}
````

### [14] 특정 회원 점수 조회

-   **Method**: GET
-   **URL**: /api/scores/23
-   **Status**: 200
-   **응답**: ```json
    {
    "status": "OK",
    "message": "점수 조회 성공",
    "data": {
    "memberId": 23,
    "score": 200
    }
    }

````

### [15] 점수 수정
- **Method**: PUT
- **URL**: /api/scores
- **Status**: 200
- **응답**: ```json
{
  "status": "OK",
  "message": "점수 수정 성공",
  "data": null
}
````

### [16] 문제 조회

-   **Method**: GET
-   **URL**: /api/problem?limit=4&category=INFOENGINEERING
-   **Status**: 200
-   **응답**: ```json
    {
    "status": "OK",
    "message": "문제가 성공적으로 반환되었습니다.",
    "data": [
    {
    "problemId": 3,
    "problemDescription": "문제3",
    "choice1": "GET",
    "choice2": "POST",
    "choice3": "PUT",
    "choice4": "DELETE",
    "answer": "POST",
    "category": "INFOENGINEERING"
    },
    {
    "problemId": 8,
    "problemDescription": "RESTful API의 특징이 아닌 것은?",
    "choice1": "Stateless",
    "choice2": "Cacheable",
    "choice3": "Stateful",
    "choice4": "Uniform Interface",
    "answer": "Stateful",
    "category": "INFOENGINEERING"
    },
    {
    "problemId": 7,
    "problemDescription": "HTTP 메서드 중 리소스를 생성하는 메서드는?",
    "choice1": "GET",
    "choice2": "POST",
    "choice3": "PUT",
    "choice4": "DELETE",
    "answer": "POST",
    "category": "INFOENGINEERING"
    },
    {
    "problemId": 6,
    "problemDescription": "문제3",
    "choice1": "GET",
    "choice2": "POST",
    "choice3": "PUT",
    "choice4": "DELETE",
    "answer": "POST",
    "category": "INFOENGINEERING"
    }
    ]
    }

````

### [17] 문제 조회 (SQLD)
- **Method**: GET
- **URL**: /api/problem?limit=4&category=SQLD
- **Status**: 200
- **응답**: ```json
{
  "status": "OK",
  "message": "문제가 성공적으로 반환되었습니다.",
  "data": [
    {
      "problemId": 1,
      "problemDescription": "문제1?",
      "choice1": "SELECT",
      "choice2": "WHERE",
      "choice3": "ORDER BY",
      "choice4": "GROUP BY",
      "answer": "WHERE",
      "category": "SQLD"
    },
    {
      "problemId": 5,
      "problemDescription": "문제2",
      "choice1": "class",
      "choice2": "extends",
      "choice3": "new",
      "choice4": "this",
      "answer": "new",
      "category": "SQLD"
    },
    {
      "problemId": 4,
      "problemDescription": "문제1?",
      "choice1": "SELECT",
      "choice2": "WHERE",
      "choice3": "ORDER BY",
      "choice4": "GROUP BY",
      "answer": "WHERE",
      "category": "SQLD"
    },
    {
      "problemId": 2,
      "problemDescription": "문제2",
      "choice1": "class",
      "choice2": "extends",
      "choice3": "new",
      "choice4": "this",
      "answer": "new",
      "category": "SQLD"
    }
  ]
}
````

### [18] 오답노트 추가 (기본 문제)

-   **Method**: POST
-   **URL**: /api/incorrect-note
-   **Status**: 201
-   **응답**: ```json
    {
    "status": "CREATED",
    "message": "오답노트를 성공적으로 생성하였습니다.",
    "data": 39
    }

````

### [18] 오답노트 추가 (유저제작문제)
- **Method**: POST
- **URL**: /api/incorrect-note
- **Status**: 201
- **응답**: ```json
{
  "status": "CREATED",
  "message": "오답노트를 성공적으로 생성하였습니다.",
  "data": 40
}
````

### [18] 오답노트 조회

-   **Method**: GET
-   **URL**: /api/incorrect-note
-   **Status**: 200
-   **응답**: ```json
    {
    "status": "OK",
    "message": "오답노트가 성공적으로 조회되었습니다",
    "data": [
    {
    "incorrectNoteId": 18,
    "problemDescription": "문제1?",
    "choice1": "SELECT",
    "choice2": "WHERE",
    "choice3": "ORDER BY",
    "choice4": "GROUP BY",
    "answer": "WHERE",
    "category": "SQLD"
    },
    {
    "incorrectNoteId": 39,
    "problemDescription": "문제1?",
    "choice1": "SELECT",
    "choice2": "WHERE",
    "choice3": "ORDER BY",
    "choice4": "GROUP BY",
    "answer": "WHERE",
    "category": "SQLD"
    },
    {
    "incorrectNoteId": 19,
    "problemDescription": "수정된 문제입니다!",
    "choice1": "수정1",
    "choice2": "수정2",
    "choice3": "수정3",
    "choice4": "수정4",
    "answer": "2",
    "category": "INFOENGINEERING"
    },
    {
    "incorrectNoteId": 20,
    "problemDescription": "수정된 문제입니다!",
    "choice1": "수정된선택지1",
    "choice2": "수정된선택지2",
    "choice3": "수정된선택지3",
    "choice4": "수정된선택지4",
    "answer": "2",
    "category": "INFOENGINEERING"
    },
    {
    "incorrectNoteId": 22,
    "problemDescription": "수정된 문제입니다!",
    "choice1": "수정1",
    "choice2": "수정2",
    "choice3": "수정3",
    "choice4": "수정4",
    "answer": "2",
    "category": "INFOENGINEERING"
    },
    {
    "incorrectNoteId": 24,
    "problemDescription": "수정된 문제입니다!",
    "choice1": "수정1",
    "choice2": "수정2",
    "choice3": "수정3",
    "choice4": "수정4",
    "answer": "2",
    "category": "INFOENGINEERING"
    },
    {
    "incorrectNoteId": 34,
    "problemDescription": "수정된 문제입니다!",
    "choice1": "수정1",
    "choice2": "수정2",
    "choice3": "수정3",
    "choice4": "수정4",
    "answer": "2",
    "category": "INFOENGINEERING"
    },
    {
    "incorrectNoteId": 36,
    "problemDescription": "수정된 문제입니다!",
    "choice1": "수정1",
    "choice2": "수정2",
    "choice3": "수정3",
    "choice4": "수정4",
    "answer": "2",
    "category": "INFOENGINEERING"
    },
    {
    "incorrectNoteId": 38,
    "problemDescription": "수정된 문제입니다!",
    "choice1": "수정1",
    "choice2": "수정2",
    "choice3": "수정3",
    "choice4": "수정4",
    "answer": "2",
    "category": "INFOENGINEERING"
    },
    {
    "incorrectNoteId": 40,
    "problemDescription": "수정된 문제입니다!",
    "choice1": "수정1",
    "choice2": "수정2",
    "choice3": "수정3",
    "choice4": "수정4",
    "answer": "2",
    "category": "INFOENGINEERING"
    }
    ]
    }

````

### [19] 오답노트 삭제
- **Method**: DELETE
- **URL**: /api/incorrect-note/39
- **Status**: 200
- **응답**: ```json
{
  "status": "OK",
  "message": null,
  "data": "오답노트가 삭제되었습니다"
}
````

### [20] 퀴즈방 목록 조회

-   **Method**: GET
-   **URL**: /api/quiz-room
-   **Status**: 200
-   **응답**: ```json
    {
    "status": "OK",
    "message": "퀴즈방 목록 조회 성공",
    "data": [
    {
    "roomId": 1
    },
    {
    "roomId": 2
    },
    {
    "roomId": 3
    },
    {
    "roomId": 4
    },
    {
    "roomId": 5
    },
    {
    "roomId": 6
    },
    {
    "roomId": 7
    },
    {
    "roomId": 8
    },
    {
    "roomId": 9
    },
    {
    "roomId": 10
    },
    {
    "roomId": 11
    },
    {
    "roomId": 12
    },
    {
    "roomId": 13
    },
    {
    "roomId": 14
    },
    {
    "roomId": 15
    },
    {
    "roomId": 16
    },
    {
    "roomId": 17
    },
    {
    "roomId": 18
    },
    {
    "roomId": 19
    },
    {
    "roomId": 20
    },
    {
    "roomId": 21
    },
    {
    "roomId": 22
    },
    {
    "roomId": 23
    },
    {
    "roomId": 24
    },
    {
    "roomId": 25
    },
    {
    "roomId": 26
    },
    {
    "roomId": 27
    },
    {
    "roomId": 28
    },
    {
    "roomId": 29
    },
    {
    "roomId": 30
    },
    {
    "roomId": 31
    }
    ]
    }

````

### [21] 퀴즈방 목록 조회
- **Method**: GET
- **URL**: /api/quiz-room
- **Status**: 200
- **응답**: ```json
{
  "status": "OK",
  "message": "퀴즈방 목록 조회 성공",
  "data": [
    {
      "roomId": 1
    },
    {
      "roomId": 2
    },
    {
      "roomId": 3
    },
    {
      "roomId": 4
    },
    {
      "roomId": 5
    },
    {
      "roomId": 6
    },
    {
      "roomId": 7
    },
    {
      "roomId": 8
    },
    {
      "roomId": 9
    },
    {
      "roomId": 10
    },
    {
      "roomId": 11
    },
    {
      "roomId": 12
    },
    {
      "roomId": 13
    },
    {
      "roomId": 14
    },
    {
      "roomId": 15
    },
    {
      "roomId": 16
    },
    {
      "roomId": 17
    },
    {
      "roomId": 18
    },
    {
      "roomId": 19
    },
    {
      "roomId": 20
    },
    {
      "roomId": 21
    },
    {
      "roomId": 22
    },
    {
      "roomId": 23
    },
    {
      "roomId": 24
    },
    {
      "roomId": 25
    },
    {
      "roomId": 26
    },
    {
      "roomId": 27
    },
    {
      "roomId": 28
    },
    {
      "roomId": 29
    },
    {
      "roomId": 30
    },
    {
      "roomId": 31
    }
  ]
}
````

---

## ❌ 실패한 테스트

### [2] 점수 등록

-   **Method**: POST
-   **URL**: /api/scores
-   **Status**: 500
-   **에러**:
  ```
 json
    {
    "status": "INTERNAL_SERVER_ERROR",
    "message": "서버 오류로 점수를 등록하지 못했습니다.",
    "data": null
    }
```



### [10] 댓글 수정
- **Method**: PATCH
- **URL**: /api/comments/19/7
- **Status**: 403
- **에러**:
```
json
{
  "status": "FORBIDDEN",
  "message": "본인의 댓글만 수정할 수 있습니다.",
  "data": null
}
```
  
### [21] 퀴즈방 멤버 조회

-   **Method**: GET
-   **URL**: /api/quiz-room/1/member
-   **Status**: 400
-   **에러**:
  ```
json
    {
    "status": "BAD_REQUEST",
    "message": "퀴즈방에 참가자가 없습니다.",
    "data": null
    }
```


### [22] 퀴즈방 생성
- **Method**: POST
- **URL**: /api/quiz-room/create/23
- **Status**: 400
- **에러**:
```
json
{
  "status": "BAD_REQUEST",
  "message": "한 멤버는 하나의 채팅방에만 들어갈 수 있습니다.",
  "data": null
}
```


**보고서 작성일**: 2025-12-02  
**테스트 환경**: Spring Boot Backend (localhost:8080), vite프록시 서버 (localhost:5500)
**데이터베이스**: MySQL (board_test)
