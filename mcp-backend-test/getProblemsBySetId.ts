// getProblemsBySetId.ts
// 문제세트 ID 1의 문제들 조회

import axios from "axios";

const BACKEND_BASE_URL = "http://localhost:8080";

async function getProblemsBySetId() {
  const userProblemSetId = 1;

  console.log("📝 문제세트의 문제들 조회\n");
  console.log("=" .repeat(70));

  try {
    console.log(`\n🌐 API 호출: GET /api/user-problems/sets/${userProblemSetId}`);
    console.log(`   URL: ${BACKEND_BASE_URL}/api/user-problems/sets/${userProblemSetId}\n`);

    const response = await axios.get(`${BACKEND_BASE_URL}/api/user-problems/sets/${userProblemSetId}`);

    console.log(`✅ API 호출 성공!`);
    console.log(`   상태 코드: ${response.status}`);
    console.log(`\n📊 API 응답:`);
    console.log(JSON.stringify(response.data, null, 2));

    // 응답 데이터 분석
    if (response.data.data && Array.isArray(response.data.data)) {
      const problems = response.data.data;
      
      console.log("\n" + "=".repeat(70));
      console.log(`\n📝 문제세트 ID ${userProblemSetId}의 문제 목록 (총 ${problems.length}개):\n`);

      problems.forEach((problem: any, index: number) => {
        console.log(`${index + 1}. [문제 ID: ${problem.userProblemId}]`);
        console.log(`   ${problem.problemDescription}`);
        console.log(`   카테고리: ${problem.category}`);
        console.log(`   선택지:`);
        console.log(`     1) ${problem.choice1}`);
        console.log(`     2) ${problem.choice2}`);
        console.log(`     3) ${problem.choice3}`);
        console.log(`     4) ${problem.choice4}`);
        console.log(`   ✅ 정답: ${problem.answer}번`);
        console.log(`   💬 댓글 수: ${problem.commentCount}개`);
        console.log();
      });

      // 카테고리별 통계
      console.log("=" .repeat(70));
      console.log("\n📊 카테고리별 통계:\n");
      
      const categoryCount: any = {};
      problems.forEach((p: any) => {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
      });

      Object.entries(categoryCount).forEach(([category, count]) => {
        console.log(`   ${category}: ${count}개`);
      });
    }

    console.log("\n" + "=".repeat(70));
    console.log("\n💡 MCP 툴로 조회:");
    console.log(`   user_problem_get_by_set_with_sql({ userProblemSetId: ${userProblemSetId} })`);
    console.log(`   sql_select_problems_by_set({ userProblemSetId: ${userProblemSetId} })\n`);

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

getProblemsBySetId();

