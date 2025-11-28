// getAllProblemSets.ts
// 전체 문제세트 조회 API 호출

import axios from "axios";
import mysql from "mysql2/promise";

const BACKEND_BASE_URL = "http://localhost:8080";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "bang_user",
  password: "bang_password",
  database: "board_test",
});

async function getAllProblemSets() {
  console.log("📦 전체 문제세트 조회 API 호출\n");
  console.log("=" .repeat(70));

  try {
    // API 호출
    console.log("\n🌐 API 호출: GET /api/user-problem-sets");
    console.log(`   URL: ${BACKEND_BASE_URL}/api/user-problem-sets\n`);

    const response = await axios.get(`${BACKEND_BASE_URL}/api/user-problem-sets`);

    console.log(`✅ API 호출 성공!`);
    console.log(`   상태 코드: ${response.status}`);
    console.log(`\n📊 API 응답:`);
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error: any) {
    if (error.response) {
      console.log(`❌ API 호출 실패 (${error.response.status})`);
      console.log(`\n📊 에러 응답:`);
      console.log(JSON.stringify(error.response.data, null, 2));
      
      // API가 실패했으므로 SQL로 직접 조회
      console.log("\n" + "=".repeat(70));
      console.log("\n🗄️  SQL로 직접 조회 (API 우회):\n");
      
      const [sets] = await pool.query(`
        SELECT 
          ups.user_problem_set_id,
          ups.member_id,
          m.nickname as member_nickname,
          COUNT(up.user_problem_id) as problem_count
        FROM user_problem_set ups
        LEFT JOIN member m ON ups.member_id = m.member_id
        LEFT JOIN user_problem up ON ups.user_problem_set_id = up.user_problem_set_id
        GROUP BY ups.user_problem_set_id, ups.member_id, m.nickname
        ORDER BY ups.user_problem_set_id
      `) as any;

      console.log(`📦 전체 문제세트 (${sets.length}개):\n`);

      sets.forEach((set: any, index: number) => {
        console.log(`${index + 1}. 문제세트 ID: ${set.user_problem_set_id}`);
        console.log(`   작성자: ${set.member_nickname || '알 수 없음'} (member_id: ${set.member_id})`);
        console.log(`   문제 수: ${set.problem_count}개\n`);
      });

      // 각 문제세트의 상세 정보
      console.log("=" .repeat(70));
      console.log("\n📝 각 문제세트의 문제 목록:\n");

      for (const set of sets) {
        const [problems] = await pool.query(`
          SELECT user_problem_id, problem_description, category, answer
          FROM user_problem
          WHERE user_problem_set_id = ?
          ORDER BY user_problem_id
        `, [set.user_problem_set_id]) as any;

        console.log(`📦 문제세트 ID ${set.user_problem_set_id} (${problems.length}개 문제):`);
        
        if (problems.length > 0) {
          problems.forEach((p: any, idx: number) => {
            console.log(`   ${idx + 1}. [ID: ${p.user_problem_id}] ${p.problem_description.substring(0, 50)}...`);
            console.log(`      카테고리: ${p.category}, 정답: ${p.answer}번`);
          });
        } else {
          console.log(`   (문제 없음)`);
        }
        console.log();
      }

      // 댓글 정보도 확인
      console.log("=" .repeat(70));
      console.log("\n💬 각 문제세트의 댓글 수:\n");

      for (const set of sets) {
        const [comments] = await pool.query(`
          SELECT COUNT(*) as comment_count
          FROM comment
          WHERE user_problem_set_id = ?
        `, [set.user_problem_set_id]) as any;

        console.log(`📦 문제세트 ID ${set.user_problem_set_id}: ${comments[0].comment_count}개 댓글`);
      }

    } else if (error.request) {
      console.log(`❌ 서버 응답 없음`);
      console.log(`   서버가 http://localhost:8080 에서 실행 중인지 확인하세요.`);
    } else {
      console.log(`❌ 요청 실패: ${error.message}`);
    }
  } finally {
    await pool.end();
  }

  console.log("\n" + "=".repeat(70));
  console.log("\n💡 MCP 툴로 조회:");
  console.log("   user_problem_set_get_all_with_sql()");
  console.log("   sql_select_all_problem_sets()\n");
}

getAllProblemSets();

