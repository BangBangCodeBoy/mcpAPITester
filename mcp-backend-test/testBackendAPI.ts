// testBackendAPI.ts
// 백엔드 API 호출 테스트

import axios from "axios";

const BACKEND_BASE_URL = "http://localhost:8080";

async function testAPIs() {
  console.log("🚀 백엔드 API 테스트 시작\n");
  console.log("=" .repeat(60));

  try {
    // Test 1: 모든 문제세트 조회
    console.log("\n📋 Test 1: GET /api/user-problem-sets");
    console.log("   설명: 모든 문제세트 조회");
    
    const res1 = await axios.get(`${BACKEND_BASE_URL}/api/user-problem-sets`);
    
    console.log(`   ✅ 상태 코드: ${res1.status}`);
    console.log(`   📊 응답 데이터:`);
    console.log(JSON.stringify(res1.data, null, 2));

    // Test 2: 특정 문제세트의 문제들 조회
    console.log("\n" + "=".repeat(60));
    console.log("\n📋 Test 2: GET /api/user-problems/sets/2");
    console.log("   설명: 문제세트 ID 2의 모든 문제 조회");
    
    const res2 = await axios.get(`${BACKEND_BASE_URL}/api/user-problems/sets/2`);
    
    console.log(`   ✅ 상태 코드: ${res2.status}`);
    console.log(`   📊 응답 데이터:`);
    console.log(JSON.stringify(res2.data, null, 2));

    // Test 3: 댓글 조회
    console.log("\n" + "=".repeat(60));
    console.log("\n📋 Test 3: GET /api/comments/2");
    console.log("   설명: 문제세트 ID 2의 댓글 조회");
    
    const res3 = await axios.get(`${BACKEND_BASE_URL}/api/comments/2`);
    
    console.log(`   ✅ 상태 코드: ${res3.status}`);
    console.log(`   📊 응답 데이터:`);
    console.log(JSON.stringify(res3.data, null, 2));

    // Test 4: 댓글 추가
    console.log("\n" + "=".repeat(60));
    console.log("\n📋 Test 4: POST /api/comments/2");
    console.log("   설명: 문제세트 ID 2에 댓글 추가");
    
    const commentData = {
      memberId: 1,
      content: "정말 좋은 문제들이네요! 특히 JAVA 접근 제어자 문제가 유익했습니다."
    };
    
    console.log(`   📝 요청 데이터:`);
    console.log(JSON.stringify(commentData, null, 2));
    
    const res4 = await axios.post(`${BACKEND_BASE_URL}/api/comments/2`, commentData);
    
    console.log(`   ✅ 상태 코드: ${res4.status}`);
    console.log(`   📊 응답 데이터:`);
    console.log(JSON.stringify(res4.data, null, 2));

    // Test 5: 추가된 댓글 다시 조회
    console.log("\n" + "=".repeat(60));
    console.log("\n📋 Test 5: GET /api/comments/2 (댓글 추가 후)");
    console.log("   설명: 댓글이 추가되었는지 확인");
    
    const res5 = await axios.get(`${BACKEND_BASE_URL}/api/comments/2`);
    
    console.log(`   ✅ 상태 코드: ${res5.status}`);
    console.log(`   📊 응답 데이터:`);
    console.log(JSON.stringify(res5.data, null, 2));

    // Test 6: 문제 수정
    console.log("\n" + "=".repeat(60));
    console.log("\n📋 Test 6: PUT /api/user-problems/7");
    console.log("   설명: 문제 ID 7 수정");
    
    const updateData = {
      problemDescription: "다음 중 JAVA의 접근 제어자가 아닌 것은? (수정됨)",
      category: "INFOENGINEERING",
      choice1: "public",
      choice2: "private",
      choice3: "protected",
      choice4: "friend",
      answer: "4"
    };
    
    console.log(`   📝 요청 데이터:`);
    console.log(JSON.stringify(updateData, null, 2));
    
    const res6 = await axios.put(`${BACKEND_BASE_URL}/api/user-problems/7`, updateData);
    
    console.log(`   ✅ 상태 코드: ${res6.status}`);
    console.log(`   📊 응답 데이터:`);
    console.log(JSON.stringify(res6.data, null, 2));

    console.log("\n" + "=".repeat(60));
    console.log("\n🎉 모든 API 테스트 성공!\n");

  } catch (error: any) {
    console.error("\n❌ API 호출 실패:");
    if (error.response) {
      console.error(`   상태 코드: ${error.response.status}`);
      console.error(`   응답 데이터:`, error.response.data);
    } else if (error.request) {
      console.error("   서버 응답 없음. 서버가 실행 중인지 확인하세요.");
      console.error(`   요청 URL: ${error.config?.url}`);
    } else {
      console.error(`   에러 메시지: ${error.message}`);
    }
  }
}

testAPIs();

