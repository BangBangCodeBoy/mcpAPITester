// insertDummyDataFromERD.ts
// ERD 기반으로 더미 데이터 삽입

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "bang_user",
  password: "bang_password",
  database: "board_test",
});

async function insertDummyData() {
  try {
    console.log("🚀 더미 데이터 삽입 시작...\n");

    // 1. 먼저 member가 있는지 확인
    console.log("📋 Step 1: 회원 확인");
    const [members] = (await pool.query("SELECT member_id, nickname FROM member LIMIT 5")) as any;
    
    if (members.length === 0) {
      console.log("⚠️  회원이 없습니다. 테스트 회원을 생성합니다...");
      await pool.query(`
        INSERT INTO member (ID, password, nickname, email, signup_date, status)
        VALUES ('testuser', '1234567890', '테스트유저', 'test@example.com', NOW(), 'ACTIVE')
      `);
      const [newMembers] = (await pool.query("SELECT member_id, nickname FROM member LIMIT 1")) as any;
      console.log(`✅ 테스트 회원 생성 완료: ${newMembers[0].nickname} (ID: ${newMembers[0].member_id})`);
    } else {
      console.log(`✅ 기존 회원 발견: ${members[0].nickname} (ID: ${members[0].member_id})`);
    }

    const [memberRows] = (await pool.query("SELECT member_id FROM member LIMIT 1")) as any;
    const memberId = memberRows[0].member_id;

    // 2. 문제세트 생성
    console.log(`\n📦 Step 2: 문제세트 생성 (member_id: ${memberId})`);
    
    const insertSetSql = `
      INSERT INTO user_problem_set (member_id)
      VALUES (?)
    `;
    const [setResult] = (await pool.query(insertSetSql, [memberId])) as any;
    const userProblemSetId = setResult.insertId;
    
    console.log(`✅ 문제세트 생성 완료! user_problem_set_id: ${userProblemSetId}\n`);

    // 3. 문제 3개 생성 (ERD 스키마에 맞춤)
    console.log(`📝 Step 3: 문제 3개 생성`);
    
    const problems = [
      {
        problemDescription: "JavaScript에서 변수를 선언할 때 사용하는 키워드가 아닌 것은?",
        category: "INFOENGINEERING",
        choice1: "var",
        choice2: "let",
        choice3: "const",
        choice4: "define",
        answer: "4",
        commentCount: 0,
        userProblemSetId: userProblemSetId,
      },
      {
        problemDescription: "다음 중 HTTP 메서드가 아닌 것은?",
        category: "SQLD",
        choice1: "GET",
        choice2: "POST",
        choice3: "FETCH",
        choice4: "DELETE",
        answer: "3",
        commentCount: 0,
        userProblemSetId: userProblemSetId,
      },
      {
        problemDescription: "SQL에서 데이터를 조회할 때 사용하는 명령어는?",
        category: "SQLD",
        choice1: "SELECT",
        choice2: "INSERT",
        choice3: "UPDATE",
        choice4: "DELETE",
        answer: "1",
        commentCount: 0,
        userProblemSetId: userProblemSetId,
      },
    ];

    // user_problem 테이블에 맞게 컬럼명 조정
    const values = problems.map(p => [
      p.problemDescription,
      p.category,
      p.choice1,
      p.choice2,
      p.choice3,
      p.choice4,
      p.answer,
      p.commentCount,
      p.userProblemSetId,
    ]);

    const insertProblemsSql = `
      INSERT INTO user_problem
      (problem_description, category, choice_1, choice_2, choice_3, choice_4, answer, comment_count, user_problem_set_id)
      VALUES ?
    `;
    
    const [problemsResult] = (await pool.query(insertProblemsSql, [values])) as any;
    
    console.log(`✅ 문제 ${problemsResult.affectedRows}개 생성 완료!\n`);

    // 4. 삽입된 데이터 확인
    console.log(`🔍 Step 4: 삽입된 데이터 확인`);
    
    const [problemSetRows] = (await pool.query(
      "SELECT * FROM user_problem_set WHERE user_problem_set_id = ?",
      [userProblemSetId]
    )) as any;
    
    const [problemRows] = (await pool.query(
      "SELECT * FROM user_problem WHERE user_problem_set_id = ?",
      [userProblemSetId]
    )) as any;

    console.log("\n📦 생성된 문제세트:");
    console.log(`   - user_problem_set_id: ${problemSetRows[0].user_problem_set_id}`);
    console.log(`   - member_id: ${problemSetRows[0].member_id}`);

    console.log("\n📝 생성된 문제들:");
    problemRows.forEach((problem: any, index: number) => {
      console.log(`\n${index + 1}. ${problem.problem_description}`);
      console.log(`   ID: ${problem.user_problem_id}`);
      console.log(`   카테고리: ${problem.category}`);
      console.log(`   선택지: 1) ${problem.choice_1}  2) ${problem.choice_2}  3) ${problem.choice_3}  4) ${problem.choice_4}`);
      console.log(`   정답: ${problem.answer}번`);
    });

    console.log("\n\n🎉 더미 데이터 삽입 완료!");
    console.log(`\n📊 결과 요약:`);
    console.log(`   - 회원 ID: ${memberId}`);
    console.log(`   - 문제세트 ID: ${userProblemSetId}`);
    console.log(`   - 생성된 문제 수: ${problemRows.length}개`);
    
    console.log(`\n💡 이제 MCP 툴로 데이터를 조회할 수 있습니다:`);
    console.log(`   - user_problem_set_get_all_with_sql`);
    console.log(`   - user_problem_get_by_set_with_sql({ userProblemSetId: ${userProblemSetId} })`);
    
  } catch (error: any) {
    console.error("❌ 에러 발생:", error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

// 스크립트 실행
insertDummyData();


