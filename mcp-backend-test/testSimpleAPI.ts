// testSimpleAPI.ts
// 간단한 API부터 테스트

import axios from "axios";

const BACKEND_BASE_URL = "http://localhost:8080";

async function testSimpleAPIs() {
  console.log("🚀 백엔드 API 간단 테스트\n");

  try {
    // Test 1: 특정 문제세트의 문제들 조회 (가장 기본적인 조회)
    console.log("📋 Test 1: GET /api/user-problems/sets/1");
    console.log("   설명: 문제세트 ID 1의 문제들 조회\n");
    
    const res1 = await axios.get(`${BACKEND_BASE_URL}/api/user-problems/sets/1`);
    
    console.log(`✅ 상태 코드: ${res1.status}`);
    console.log(`📊 응답:`);
    console.log(JSON.stringify(res1.data, null, 2));
    
    console.log("\n" + "=".repeat(60) + "\n");

    // Test 2: 댓글 조회
    console.log("📋 Test 2: GET /api/comments/1");
    console.log("   설명: 문제세트 ID 1의 댓글 조회\n");
    
    const res2 = await axios.get(`${BACKEND_BASE_URL}/api/comments/1`);
    
    console.log(`✅ 상태 코드: ${res2.status}`);
    console.log(`📊 응답:`);
    console.log(JSON.stringify(res2.data, null, 2));

    console.log("\n" + "=".repeat(60) + "\n");

    // Test 3: 댓글 추가
    console.log("📋 Test 3: POST /api/comments/1");
    console.log("   설명: 댓글 추가\n");
    
    const commentData = {
      memberId: 1,
      content: "MCP 툴 테스트 댓글입니다!"
    };
    
    console.log("📝 요청 데이터:", commentData);
    
    const res3 = await axios.post(`${BACKEND_BASE_URL}/api/comments/1`, commentData);
    
    console.log(`\n✅ 상태 코드: ${res3.status}`);
    console.log(`📊 응답:`);
    console.log(JSON.stringify(res3.data, null, 2));

    console.log("\n🎉 테스트 성공!\n");

  } catch (error: any) {
    console.error("\n❌ API 호출 실패:");
    if (error.response) {
      console.error(`   상태 코드: ${error.response.status}`);
      console.error(`   에러 메시지:`, error.response.data);
      console.error(`   요청 URL: ${error.config?.url}`);
    } else if (error.request) {
      console.error("   서버 응답 없음.");
      console.error("   서버가 http://localhost:8080 에서 실행 중인지 확인하세요.");
    } else {
      console.error(`   에러: ${error.message}`);
    }
  }
}

testSimpleAPIs();

