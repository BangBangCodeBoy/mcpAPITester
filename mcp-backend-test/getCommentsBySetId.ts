// getCommentsBySetId.ts
// 문제세트 ID 1의 댓글 조회

import axios from "axios";

const BACKEND_BASE_URL = "http://localhost:8080";

async function getCommentsBySetId() {
  const userProblemSetId = 1;

  console.log("💬 문제세트의 댓글 조회\n");
  console.log("=" .repeat(70));

  try {
    console.log(`\n🌐 API 호출: GET /api/comments/${userProblemSetId}`);
    console.log(`   URL: ${BACKEND_BASE_URL}/api/comments/${userProblemSetId}\n`);

    const response = await axios.get(`${BACKEND_BASE_URL}/api/comments/${userProblemSetId}`);

    console.log(`✅ API 호출 성공!`);
    console.log(`   상태 코드: ${response.status}`);
    console.log(`\n📊 API 응답:`);
    console.log(JSON.stringify(response.data, null, 2));

    // 응답 데이터 분석
    if (response.data.data && Array.isArray(response.data.data)) {
      const comments = response.data.data;
      
      console.log("\n" + "=".repeat(70));
      console.log(`\n💬 문제세트 ID ${userProblemSetId}의 댓글 목록 (총 ${comments.length}개):\n`);

      if (comments.length === 0) {
        console.log("   댓글이 없습니다.\n");
      } else {
        comments.forEach((comment: any, index: number) => {
          console.log(`${index + 1}. [댓글 ID: ${comment.commentId}]`);
          console.log(`   작성자: member_id ${comment.memberId}`);
          console.log(`   내용: ${comment.content}`);
          console.log(`   작성일: ${new Date(comment.commentDate).toLocaleString('ko-KR')}`);
          console.log();
        });

        // 통계
        console.log("=" .repeat(70));
        console.log("\n📊 댓글 통계:\n");
        
        const memberCount: any = {};
        comments.forEach((c: any) => {
          memberCount[c.memberId] = (memberCount[c.memberId] || 0) + 1;
        });

        console.log(`   총 댓글 수: ${comments.length}개`);
        console.log(`   작성자 수: ${Object.keys(memberCount).length}명`);
        Object.entries(memberCount).forEach(([memberId, count]) => {
          console.log(`   member_id ${memberId}: ${count}개 댓글`);
        });
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("\n💡 MCP 툴로 조회:");
    console.log(`   comment_get_all_by_set_with_sql({ userProblemSetId: ${userProblemSetId} })`);
    console.log(`   sql_select_comments_by_set({ userProblemSetId: ${userProblemSetId} })\n`);

  } catch (error: any) {
    if (error.response) {
      console.log(`❌ API 호출 실패 (${error.response.status})`);
      console.log(`\n📊 에러 응답:`);
      console.log(JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log(`❌ 서버 응답 없음`);
      console.log(`   서버가 http://localhost:8080 에서 실행 중인지 확인하세요.`);
    } else {
      console.log(`❌ 요청 실패: ${error.message}`);
    }
  }
}

getCommentsBySetId();

