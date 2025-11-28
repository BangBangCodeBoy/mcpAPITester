// testConnection.ts
// 서버 연결 및 기본 health check

import axios from "axios";

const BACKEND_BASE_URL = "http://localhost:8080";

async function testConnection() {
  console.log("🔍 백엔드 서버 연결 테스트\n");

  try {
    // Test 1: 서버가 살아있는지 확인
    console.log("1️⃣ 서버 연결 테스트...");
    const res = await axios.get(`${BACKEND_BASE_URL}/`, { timeout: 3000 });
    console.log(`   ✅ 서버 응답: ${res.status}`);
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`   ❌ 서버 연결 실패: ${BACKEND_BASE_URL}에 서버가 없습니다.`);
      console.log(`   💡 스프링 서버가 실행 중인지 확인하세요.`);
      return;
    } else if (error.response) {
      console.log(`   ✅ 서버는 실행 중입니다 (상태: ${error.response.status})`);
    }
  }

  // Test 2: API 엔드포인트 테스트
  console.log("\n2️⃣ API 엔드포인트 테스트...");
  
  const endpoints = [
    { method: 'GET', url: '/api/user-problems/sets/1', desc: '문제 조회' },
    { method: 'GET', url: '/api/comments/1', desc: '댓글 조회' },
    { method: 'GET', url: '/api/user-problem-sets', desc: '문제세트 전체 조회' },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n   📋 ${endpoint.method} ${endpoint.url}`);
      console.log(`      설명: ${endpoint.desc}`);
      
      const res = await axios({
        method: endpoint.method,
        url: `${BACKEND_BASE_URL}${endpoint.url}`,
        timeout: 5000
      });
      
      console.log(`      ✅ 성공 (${res.status})`);
      console.log(`      데이터:`, JSON.stringify(res.data).substring(0, 100) + '...');
      
    } catch (error: any) {
      if (error.response) {
        console.log(`      ❌ 에러 (${error.response.status})`);
        console.log(`      메시지:`, error.response.data?.message || error.response.data);
      } else {
        console.log(`      ❌ 요청 실패:`, error.message);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n💡 서버 에러가 발생하는 경우:");
  console.log("   1. 스프링 서버 로그 확인");
  console.log("   2. DB 연결 상태 확인");
  console.log("   3. MyBatis Mapper 설정 확인");
  console.log("   4. Controller 메서드 확인\n");
}

testConnection();

