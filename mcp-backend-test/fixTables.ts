// fixTables.ts
// 테이블 구조를 수정하는 스크립트

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "bang_user",
  password: "bang_password",
  database: "board_test",
});

async function fixTables() {
  try {
    console.log("🔧 테이블 구조 수정 시작...\n");

    // 1. user_problem_set 테이블 수정
    console.log("📋 1. user_problem_set 테이블 수정 중...");
    
    try {
      await pool.query("ALTER TABLE user_problem_set ADD PRIMARY KEY (user_problem_set_id)");
      console.log("  ✅ PRIMARY KEY 추가 완료");
    } catch (e: any) {
      if (e.code === 'ER_MULTIPLE_PRI_KEY') {
        console.log("  ℹ️  PRIMARY KEY가 이미 존재합니다");
      } else {
        throw e;
      }
    }

    await pool.query(`
      ALTER TABLE user_problem_set 
      MODIFY COLUMN user_problem_set_id BIGINT NOT NULL AUTO_INCREMENT
    `);
    console.log("  ✅ AUTO_INCREMENT 추가 완료\n");

    // 2. user_problem 테이블 수정
    console.log("📋 2. user_problem 테이블 수정 중...");
    
    try {
      await pool.query("ALTER TABLE user_problem ADD PRIMARY KEY (user_problem_id)");
      console.log("  ✅ PRIMARY KEY 추가 완료");
    } catch (e: any) {
      if (e.code === 'ER_MULTIPLE_PRI_KEY') {
        console.log("  ℹ️  PRIMARY KEY가 이미 존재합니다");
      } else {
        throw e;
      }
    }

    await pool.query(`
      ALTER TABLE user_problem 
      MODIFY COLUMN user_problem_id BIGINT NOT NULL AUTO_INCREMENT
    `);
    console.log("  ✅ AUTO_INCREMENT 추가 완료\n");

    // 3. comment 테이블 수정
    console.log("📋 3. comment 테이블 수정 중...");
    
    try {
      await pool.query("ALTER TABLE comment ADD PRIMARY KEY (comment_id)");
      console.log("  ✅ PRIMARY KEY 추가 완료");
    } catch (e: any) {
      if (e.code === 'ER_MULTIPLE_PRI_KEY') {
        console.log("  ℹ️  PRIMARY KEY가 이미 존재합니다");
      } else {
        throw e;
      }
    }

    await pool.query(`
      ALTER TABLE comment 
      MODIFY COLUMN comment_id BIGINT NOT NULL AUTO_INCREMENT
    `);
    console.log("  ✅ AUTO_INCREMENT 추가 완료\n");

    console.log("🎉 모든 테이블 수정 완료!");
    console.log("\n다음 명령어로 더미 데이터를 삽입하세요:");
    console.log("  npx tsx insertDummyData.ts\n");

  } catch (error: any) {
    console.error("❌ 에러 발생:", error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

fixTables();


