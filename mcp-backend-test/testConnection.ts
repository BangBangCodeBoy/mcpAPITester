// testConnection.ts
// DB 연결 및 기본 정보 확인

import mysql from "mysql2/promise";

async function testConnection() {
  // 다양한 DB 설정을 시도
  const configs = [
    {
      name: "기본 설정",
      config: {
        host: "localhost",
        port: 3306,
        user: "bang_user",
        password: "bang_password",
        database: "board_test",
      }
    },
    {
      name: "root 계정",
      config: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "bang_password",
        database: "board_test",
      }
    },
    {
      name: "root with empty password",
      config: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "board_test",
      }
    }
  ];

  for (const { name, config } of configs) {
    try {
      console.log(`\n🔍 ${name} 시도 중...`);
      const pool = mysql.createPool(config);
      
      // 연결 테스트
      const [rows] = await pool.query("SELECT 1 as test") as any;
      console.log(`✅ ${name} 연결 성공!`);
      
      // 현재 사용자 확인
      const [userRows] = await pool.query("SELECT USER() as current_user") as any;
      console.log(`   현재 사용자: ${userRows[0].current_user}`);
      
      // 데이터베이스 목록 확인
      const [dbRows] = await pool.query("SHOW DATABASES") as any;
      console.log(`   접근 가능한 데이터베이스: ${dbRows.map((r: any) => r.Database).join(", ")}`);
      
      // board_test 데이터베이스의 테이블 확인
      try {
        const [tableRows] = await pool.query("SHOW TABLES FROM board_test") as any;
        console.log(`   board_test의 테이블들:`);
        tableRows.forEach((row: any) => {
          const tableName = Object.values(row)[0];
          console.log(`     - ${tableName}`);
        });
        
        // member 테이블에서 ID 확인
        try {
          const [memberRows] = await pool.query("SELECT member_id FROM board_test.member LIMIT 5") as any;
          if (memberRows.length > 0) {
            console.log(`   사용 가능한 member_id들: ${memberRows.map((r: any) => r.member_id).join(", ")}`);
          }
        } catch (e) {
          console.log(`   ⚠️ member 테이블 조회 불가`);
        }
        
      } catch (e: any) {
        console.log(`   ⚠️ board_test 테이블 조회 실패: ${e.message}`);
      }
      
      await pool.end();
      
      // 성공한 경우 이 설정 사용
      console.log(`\n✅ 이 설정을 사용하세요:`);
      console.log(JSON.stringify(config, null, 2));
      return config;
      
    } catch (error: any) {
      console.log(`❌ ${name} 실패: ${error.message}`);
    }
  }
  
  console.log("\n❌ 모든 연결 시도 실패");
}

testConnection();


