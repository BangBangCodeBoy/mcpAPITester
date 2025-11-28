// checkTables.ts
// 테이블 구조 확인 및 수정

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "bang_user",
  password: "bang_password",
  database: "board_test",
});

async function checkAndFixTables() {
  try {
    console.log("🔍 테이블 구조 확인 중...\n");

    // user_problem_set 테이블 구조 확인
    const [setPK] = (await pool.query(
      "SHOW COLUMNS FROM user_problem_set WHERE `Key` = 'PRI'"
    )) as any;
    
    console.log("📋 user_problem_set 기본키:", setPK);

    // Extra 필드 확인 (AUTO_INCREMENT 여부)
    const [setColumns] = (await pool.query(
      "SHOW COLUMNS FROM user_problem_set"
    )) as any;
    
    console.log("\n📋 user_problem_set 컬럼 정보:");
    setColumns.forEach((col: any) => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Extra}`);
    });

    // AUTO_INCREMENT가 없으면 수정
    const pkColumn = setColumns.find((col: any) => col.Field === 'user_problem_set_id');
    
    if (!pkColumn.Extra.includes('auto_increment')) {
      console.log("\n⚠️  user_problem_set_id에 AUTO_INCREMENT가 없습니다. 수정합니다...");
      
      // AUTO_INCREMENT 추가
      await pool.query(`
        ALTER TABLE user_problem_set 
        MODIFY COLUMN user_problem_set_id BIGINT NOT NULL AUTO_INCREMENT
      `);
      
      console.log("✅ user_problem_set_id AUTO_INCREMENT 추가 완료!");
    } else {
      console.log("\n✅ user_problem_set_id는 이미 AUTO_INCREMENT입니다.");
    }

    // user_problem 테이블도 확인
    const [problemColumns] = (await pool.query(
      "SHOW COLUMNS FROM user_problem"
    )) as any;
    
    console.log("\n📋 user_problem 컬럼 정보:");
    problemColumns.forEach((col: any) => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Extra}`);
    });

    const problemPK = problemColumns.find((col: any) => col.Field === 'user_problem_id');
    
    if (!problemPK.Extra.includes('auto_increment')) {
      console.log("\n⚠️  user_problem_id에 AUTO_INCREMENT가 없습니다. 수정합니다...");
      
      await pool.query(`
        ALTER TABLE user_problem 
        MODIFY COLUMN user_problem_id BIGINT NOT NULL AUTO_INCREMENT
      `);
      
      console.log("✅ user_problem_id AUTO_INCREMENT 추가 완료!");
    } else {
      console.log("\n✅ user_problem_id는 이미 AUTO_INCREMENT입니다.");
    }

    // comment 테이블도 확인
    const [commentColumns] = (await pool.query(
      "SHOW COLUMNS FROM comment"
    )) as any;
    
    console.log("\n📋 comment 컬럼 정보:");
    commentColumns.forEach((col: any) => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Extra}`);
    });

    const commentPK = commentColumns.find((col: any) => col.Field === 'comment_id');
    
    if (!commentPK.Extra.includes('auto_increment')) {
      console.log("\n⚠️  comment_id에 AUTO_INCREMENT가 없습니다. 수정합니다...");
      
      await pool.query(`
        ALTER TABLE comment 
        MODIFY COLUMN comment_id BIGINT NOT NULL AUTO_INCREMENT
      `);
      
      console.log("✅ comment_id AUTO_INCREMENT 추가 완료!");
    } else {
      console.log("\n✅ comment_id는 이미 AUTO_INCREMENT입니다.");
    }

    console.log("\n🎉 모든 테이블 확인 및 수정 완료!");

  } catch (error: any) {
    console.error("❌ 에러 발생:", error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

checkAndFixTables();


