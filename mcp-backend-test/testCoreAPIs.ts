// testCoreAPIs.ts
// Comment, UserProblem, UserProblemSet API만 테스트

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

async function testCoreAPIs() {
  console.log("🚀 핵심 API 테스트 (Comment, UserProblem, UserProblemSet)\n");
  console.log("=" .repeat(70));

  try {
    // ===== UserProblem API 테스트 =====
    console.log("\n📝 [UserProblem API 테스트]\n");

    // Test 1: 문제 조회
    console.log("1️⃣ GET /api/user-problems/sets/1");
    console.log("   설명: 문제세트 ID 1의 문제들 조회\n");
    
    try {
      const res1 = await axios.get(`${BACKEND_BASE_URL}/api/user-problems/sets/1`);
      console.log(`   ✅ 성공! 상태: ${res1.status}`);
      console.log(`   📊 응답:`);
      console.log(JSON.stringify(res1.data, null, 2));
      
      // DB에서도 확인
      const [dbRows] = await pool.query("SELECT * FROM user_problem WHERE user_problem_set_id = 1") as any;
      console.log(`\n   🗄️  DB 확인: ${dbRows.length}개 문제 존재`);
      
    } catch (error: any) {
      console.log(`   ❌ 실패: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log(`   에러:`, error.response.data);
      }
    }

    console.log("\n" + "=".repeat(70));

    // Test 2: 문제 생성
    console.log("\n2️⃣ POST /api/user-problems/sets/1");
    console.log("   설명: 새로운 문제 추가\n");
    
    const newProblems = [
      {
        problemDescription: "테스트 문제: 다음 중 스프링의 핵심 개념이 아닌 것은?",
        category: "INFOENGINEERING",
        choice1: "IoC",
        choice2: "DI",
        choice3: "AOP",
        choice4: "MVC++",
        answer: "4"
      }
    ];
    
    console.log(`   📝 요청 데이터:`, JSON.stringify(newProblems, null, 2));
    
    try {
      const res2 = await axios.post(`${BACKEND_BASE_URL}/api/user-problems/sets/1`, newProblems);
      console.log(`\n   ✅ 성공! 상태: ${res2.status}`);
      console.log(`   📊 응답:`);
      console.log(JSON.stringify(res2.data, null, 2));
    } catch (error: any) {
      console.log(`   ❌ 실패: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log(`   에러:`, error.response.data);
      }
    }

    console.log("\n" + "=".repeat(70));

    // ===== Comment API 테스트 =====
    console.log("\n💬 [Comment API 테스트]\n");

    // Test 3: 댓글 조회
    console.log("3️⃣ GET /api/comments/1");
    console.log("   설명: 문제세트 ID 1의 댓글 조회\n");
    
    try {
      const res3 = await axios.get(`${BACKEND_BASE_URL}/api/comments/1`);
      console.log(`   ✅ 성공! 상태: ${res3.status}`);
      console.log(`   📊 응답:`);
      console.log(JSON.stringify(res3.data, null, 2));
    } catch (error: any) {
      console.log(`   ❌ 실패: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log(`   에러:`, error.response.data);
      }
    }

    console.log("\n" + "=".repeat(70));

    // Test 4: 댓글 추가
    console.log("\n4️⃣ POST /api/comments/1");
    console.log("   설명: 새로운 댓글 추가\n");
    
    const newComment = {
      memberId: 1,
      content: "API 테스트 댓글입니다! 문제가 정말 유익하네요 👍"
    };
    
    console.log(`   📝 요청 데이터:`, JSON.stringify(newComment, null, 2));
    
    try {
      const res4 = await axios.post(`${BACKEND_BASE_URL}/api/comments/1`, newComment);
      console.log(`\n   ✅ 성공! 상태: ${res4.status}`);
      console.log(`   📊 응답:`);
      console.log(JSON.stringify(res4.data, null, 2));
      
      // 댓글이 추가되었는지 다시 조회
      console.log(`\n   🔍 댓글 추가 확인...`);
      const res4_check = await axios.get(`${BACKEND_BASE_URL}/api/comments/1`);
      console.log(`   📊 현재 댓글 수: ${res4_check.data.data?.length || 0}개`);
      
    } catch (error: any) {
      console.log(`   ❌ 실패: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log(`   에러:`, error.response.data);
      }
    }

    console.log("\n" + "=".repeat(70));

    // ===== UserProblemSet API 테스트 =====
    console.log("\n📦 [UserProblemSet API 테스트]\n");

    // Test 5: 문제세트 생성
    console.log("5️⃣ POST /api/user-problem-sets");
    console.log("   설명: 새로운 문제세트 생성\n");
    
    try {
      const res5 = await axios.post(`${BACKEND_BASE_URL}/api/user-problem-sets`);
      console.log(`   ✅ 성공! 상태: ${res5.status}`);
      console.log(`   📊 응답:`);
      console.log(JSON.stringify(res5.data, null, 2));
      
      // DB에서 확인
      const [sets] = await pool.query("SELECT * FROM user_problem_set ORDER BY user_problem_set_id DESC LIMIT 1") as any;
      if (sets.length > 0) {
        console.log(`\n   🗄️  DB 확인: 최신 문제세트 ID = ${sets[0].user_problem_set_id}`);
      }
      
    } catch (error: any) {
      console.log(`   ❌ 실패: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log(`   에러:`, error.response.data);
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("\n🎉 API 테스트 완료!\n");

  } catch (error: any) {
    console.error("\n❌ 전체 테스트 실패:", error.message);
  } finally {
    await pool.end();
  }
}

testCoreAPIs();

