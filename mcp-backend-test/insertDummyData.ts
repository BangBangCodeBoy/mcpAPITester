// insertDummyData.ts
// MCP 툴을 사용하여 더미 데이터를 삽입하는 스크립트

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

    // 1. 문제세트 생성 (memberId = 1로 가정)
    const memberId = 1;
    console.log(`📦 Step 1: 문제세트 생성 (memberId: ${memberId})`);
    
    const insertSetSql = `
      INSERT INTO user_problem_set (member_id)
      VALUES (?)
    `;
    const [setResult] = (await pool.query(insertSetSql, [memberId])) as any;
    const userProblemSetId = setResult.insertId;
    
    console.log(`✅ 문제세트 생성 완료! ID: ${userProblemSetId}\n`);

    // 2. 문제 3개 생성
    console.log(`📝 Step 2: 문제 3개 생성`);
    
    const problems = [
      {
        problemDescription: "JavaScript에서 변수를 선언할 때 사용하는 키워드가 아닌 것은?",
        category: "JAVASCRIPT",
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
        category: "NETWORK",
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
        category: "DATABASE",
        choice1: "SELECT",
        choice2: "INSERT",
        choice3: "UPDATE",
        choice4: "DELETE",
        answer: "1",
        commentCount: 0,
        userProblemSetId: userProblemSetId,
      },
    ];

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

    // 3. 삽입된 데이터 확인
    console.log(`🔍 Step 3: 삽입된 데이터 확인`);
    
    const [problemSetRows] = (await pool.query(
      "SELECT * FROM user_problem_set WHERE user_problem_set_id = ?",
      [userProblemSetId]
    )) as any;
    
    const [problemRows] = (await pool.query(
      "SELECT * FROM user_problem WHERE user_problem_set_id = ?",
      [userProblemSetId]
    )) as any;

    console.log("\n📦 생성된 문제세트:");
    console.log(problemSetRows);

    console.log("\n📝 생성된 문제들:");
    problemRows.forEach((problem: any, index: number) => {
      console.log(`\n${index + 1}. ${problem.problem_description}`);
      console.log(`   카테고리: ${problem.category}`);
      console.log(`   정답: ${problem.answer}번`);
    });

    console.log("\n\n🎉 더미 데이터 삽입 완료!");
    console.log(`\n📊 결과 요약:`);
    console.log(`   - 문제세트 ID: ${userProblemSetId}`);
    console.log(`   - 생성된 문제 수: ${problemRows.length}개`);
    
  } catch (error: any) {
    console.error("❌ 에러 발생:", error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

// 스크립트 실행
insertDummyData();


