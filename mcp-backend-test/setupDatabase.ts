// setupDatabase.ts
// ERD SQL을 실행하여 데이터베이스 초기화

import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

async function setupDatabase() {
  // root 연결 시도
  const configs = [
    {
      name: "bang_user 계정",
      config: {
        host: "localhost",
        port: 3306,
        user: "bang_user",
        password: "bang_password",
        multipleStatements: true,
      }
    },
    {
      name: "root 계정",
      config: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "bang_password",
        multipleStatements: true,
      }
    },
    {
      name: "root (빈 비밀번호)",
      config: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        multipleStatements: true,
      }
    }
  ];

  for (const { name, config } of configs) {
    try {
      console.log(`\n🔍 ${name}로 시도 중...`);
      const connection = await mysql.createConnection(config);

      // ERD SQL 파일 읽기
      const sqlPath = path.join(__dirname, "..", "erdver5.sql");
      const sqlContent = fs.readFileSync(sqlPath, "utf8");

      console.log(`📄 erdver5.sql 파일 로드 완료`);
      console.log(`🚀 SQL 실행 중... (시간이 걸릴 수 있습니다)\n`);

      // SQL 실행
      await connection.query(sqlContent);

      console.log(`✅ 데이터베이스 초기화 완료!`);
      console.log(`✅ ${name}으로 성공했습니다!\n`);

      // 생성된 테이블 확인
      const [tables] = await connection.query("SHOW TABLES FROM board_test") as any;
      console.log(`📋 생성된 테이블 목록:`);
      tables.forEach((table: any) => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });

      // member 테이블의 데이터 확인
      const [members] = await connection.query("SELECT member_id, nickname FROM board_test.member") as any;
      console.log(`\n👥 생성된 회원 (${members.length}명):`);
      members.forEach((member: any) => {
        console.log(`   - ${member.nickname} (ID: ${member.member_id})`);
      });

      await connection.end();

      console.log(`\n🎉 초기화 완료! 이제 더미 데이터를 삽입할 수 있습니다:`);
      console.log(`   npx tsx insertDummyDataFromERD.ts\n`);

      return;

    } catch (error: any) {
      console.log(`❌ ${name} 실패: ${error.message}`);
    }
  }

  console.log("\n❌ 모든 연결 시도 실패");
  console.log("\n💡 해결 방법:");
  console.log("   1. MySQL 서버가 실행 중인지 확인");
  console.log("   2. 올바른 계정 정보 확인");
  console.log("   3. 권한 설정 확인");
}

setupDatabase();


