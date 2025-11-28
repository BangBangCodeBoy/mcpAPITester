// createProblemSetWithProblems.ts
// 문제세트 생성 + 문제 일괄 등록 시나리오

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "bang_user",
  password: "bang_password",
  database: "board_test",
});

async function createProblemSetWithProblems() {
  try {
    console.log("🎯 시나리오 시작: 문제세트 생성 + 문제 일괄 등록\n");
    console.log("=" .repeat(60));

    // Step 1: 문제세트 생성
    const memberId = 1; // 닉네임1 사용
    
    console.log("\n📦 Step 1: 문제세트 생성");
    console.log(`   회원 ID: ${memberId}`);
    
    const createSetSql = `
      INSERT INTO user_problem_set (member_id)
      VALUES (?)
    `;
    
    const [setResult] = (await pool.query(createSetSql, [memberId])) as any;
    const userProblemSetId = setResult.insertId;
    
    console.log(`   ✅ 문제세트 생성 완료!`);
    console.log(`   📝 생성된 문제세트 ID: ${userProblemSetId}\n`);
    console.log("   📄 실행된 SQL:");
    console.log(`      ${createSetSql.trim().replace(/\n\s+/g, " ")}`);
    console.log(`      파라미터: [${memberId}]`);

    // Step 2: 문제 여러 개 일괄 등록
    console.log("\n" + "=".repeat(60));
    console.log("\n📝 Step 2: 문제 일괄 등록");
    
    const problems = [
      {
        description: "다음 중 JAVA의 접근 제어자가 아닌 것은?",
        category: "INFOENGINEERING",
        choice1: "public",
        choice2: "private",
        choice3: "protected",
        choice4: "friend",
        answer: "4"
      },
      {
        description: "HTTP 상태 코드 중 성공을 나타내는 코드는?",
        category: "SQLD",
        choice1: "404",
        choice2: "500",
        choice3: "200",
        choice4: "302",
        answer: "3"
      },
      {
        description: "관계형 데이터베이스에서 기본키의 특징이 아닌 것은?",
        category: "SQLD",
        choice1: "유일성",
        choice2: "최소성",
        choice3: "중복 허용",
        choice4: "NOT NULL",
        answer: "3"
      },
      {
        description: "다음 중 객체지향 프로그래밍의 특징이 아닌 것은?",
        category: "INFOENGINEERING",
        choice1: "캡슐화",
        choice2: "상속",
        choice3: "다형성",
        choice4: "선형성",
        answer: "4"
      },
      {
        description: "SQL에서 중복을 제거하고 조회하는 키워드는?",
        category: "SQLD",
        choice1: "UNIQUE",
        choice2: "DISTINCT",
        choice3: "REMOVE",
        choice4: "DELETE",
        answer: "2"
      }
    ];

    console.log(`   등록할 문제 수: ${problems.length}개\n`);

    problems.forEach((p, idx) => {
      console.log(`   ${idx + 1}. ${p.description}`);
      console.log(`      카테고리: ${p.category}`);
      console.log(`      정답: ${p.answer}번 (${[p.choice1, p.choice2, p.choice3, p.choice4][parseInt(p.answer) - 1]})`);
    });

    const values = problems.map(p => [
      p.description,
      p.category,
      p.choice1,
      p.choice2,
      p.choice3,
      p.choice4,
      p.answer,
      0, // comment_count
      userProblemSetId
    ]);

    const insertProblemsSql = `
      INSERT INTO user_problem
      (problem_description, category, choice_1, choice_2, choice_3, choice_4, answer, comment_count, user_problem_set_id)
      VALUES ?
    `;

    const [problemsResult] = (await pool.query(insertProblemsSql, [values])) as any;

    console.log(`\n   ✅ 문제 ${problemsResult.affectedRows}개 일괄 등록 완료!`);
    console.log(`\n   📄 실행된 SQL:`);
    console.log(`      INSERT INTO user_problem (problem_description, category, ...)`);
    console.log(`      VALUES (여러 행)`);

    // Step 3: 결과 확인
    console.log("\n" + "=".repeat(60));
    console.log("\n🔍 Step 3: 등록 결과 확인");

    const [setProblemSetRows] = (await pool.query(
      "SELECT * FROM user_problem_set WHERE user_problem_set_id = ?",
      [userProblemSetId]
    )) as any;

    const [problemRows] = (await pool.query(
      "SELECT * FROM user_problem WHERE user_problem_set_id = ? ORDER BY user_problem_id",
      [userProblemSetId]
    )) as any;

    console.log("\n📦 문제세트 정보:");
    console.log(`   user_problem_set_id: ${setProblemSetRows[0].user_problem_set_id}`);
    console.log(`   member_id: ${setProblemSetRows[0].member_id}`);

    console.log("\n📝 등록된 문제 목록:");
    problemRows.forEach((problem: any, index: number) => {
      console.log(`\n   ${index + 1}. [ID: ${problem.user_problem_id}] ${problem.problem_description}`);
      console.log(`      카테고리: ${problem.category}`);
      console.log(`      선택지:`);
      console.log(`        1) ${problem.choice_1}`);
      console.log(`        2) ${problem.choice_2}`);
      console.log(`        3) ${problem.choice_3}`);
      console.log(`        4) ${problem.choice_4}`);
      console.log(`      ✅ 정답: ${problem.answer}번`);
      console.log(`      댓글 수: ${problem.comment_count}개`);
    });

    // Step 4: API 응답 형식으로 출력
    console.log("\n" + "=".repeat(60));
    console.log("\n📊 API 응답 형식:");
    console.log(JSON.stringify({
      api: {
        endpoint: "POST /api/user-problem-sets + POST /api/user-problems/sets/{id}",
        status: 201,
        message: "문제세트 및 문제 등록 성공"
      },
      sql: {
        apiName: "user_problem_set_create + user_problem_create_bulk",
        sqlQueries: [
          {
            query: "insertUserProblemSet",
            sql: createSetSql.trim().replace(/\n\s+/g, " "),
            params: { memberId },
            result: { insertId: userProblemSetId, affectedRows: 1 }
          },
          {
            query: "insertUserProblemList",
            sql: "INSERT INTO user_problem (...) VALUES ?",
            params: { problemCount: problems.length, userProblemSetId },
            result: { affectedRows: problemsResult.affectedRows }
          }
        ]
      },
      data: {
        userProblemSetId: userProblemSetId,
        memberId: memberId,
        problems: problemRows.map((p: any) => ({
          userProblemId: p.user_problem_id,
          problemDescription: p.problem_description,
          category: p.category,
          answer: p.answer,
          commentCount: p.comment_count
        }))
      }
    }, null, 2));

    console.log("\n" + "=".repeat(60));
    console.log("\n🎉 시나리오 완료!");
    console.log(`\n📊 최종 결과:`);
    console.log(`   ✅ 문제세트 ID: ${userProblemSetId}`);
    console.log(`   ✅ 등록된 문제: ${problemRows.length}개`);
    console.log(`   ✅ 회원 ID: ${memberId}\n`);

    console.log("💡 MCP 툴로 조회하기:");
    console.log(`   user_problem_set_get_all_with_sql()`);
    console.log(`   user_problem_get_by_set_with_sql({ userProblemSetId: ${userProblemSetId} })\n`);

  } catch (error: any) {
    console.error("\n❌ 에러 발생:", error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

createProblemSetWithProblems();


