// addComment.ts
// 문제세트 ID 1에 댓글 추가

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "bang_user",
  password: "bang_password",
  database: "board_test",
});

async function addComment() {
  try {
    console.log("💬 댓글 추가 시작\n");
    console.log("=" .repeat(70));

    const userProblemSetId = 1;
    const memberId = 1; // 닉네임1
    const content = "정말 유익한 문제들이네요! 특히 JavaScript 변수 선언 문제가 좋았습니다. 👍";
    const commentDate = new Date();

    console.log("\n📝 댓글 정보:");
    console.log(`   문제세트 ID: ${userProblemSetId}`);
    console.log(`   작성자 ID: ${memberId}`);
    console.log(`   내용: ${content}`);
    console.log(`   작성 시간: ${commentDate.toLocaleString('ko-KR')}`);

    // 댓글 삽입
    console.log("\n🔄 댓글 삽입 중...");
    
    const insertSql = `
      INSERT INTO comment (member_id, content, comment_date, user_problem_set_id)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertSql, [
      memberId,
      content,
      commentDate,
      userProblemSetId
    ]) as any;

    console.log(`✅ 댓글 삽입 성공!`);
    console.log(`   comment_id: ${result.insertId}`);
    console.log(`   affected rows: ${result.affectedRows}`);

    // 삽입된 댓글 확인
    console.log("\n" + "=".repeat(70));
    console.log("\n🔍 삽입된 댓글 확인:");

    const [comments] = await pool.query(
      "SELECT * FROM comment WHERE user_problem_set_id = ? ORDER BY comment_date DESC",
      [userProblemSetId]
    ) as any;

    console.log(`\n💬 문제세트 ID ${userProblemSetId}의 전체 댓글 (${comments.length}개):\n`);

    comments.forEach((comment: any, index: number) => {
      console.log(`${index + 1}. [댓글 ID: ${comment.comment_id}]`);
      console.log(`   작성자: member_id ${comment.member_id}`);
      console.log(`   내용: ${comment.content}`);
      console.log(`   작성일: ${new Date(comment.comment_date).toLocaleString('ko-KR')}`);
      console.log();
    });

    // SQL 쿼리 정보 출력
    console.log("=" .repeat(70));
    console.log("\n📄 실행된 SQL:");
    console.log(insertSql.trim().replace(/\n\s+/g, " "));
    console.log("\n📊 파라미터:");
    console.log(JSON.stringify({
      memberId,
      content,
      commentDate: commentDate.toISOString(),
      userProblemSetId
    }, null, 2));

    console.log("\n🎉 댓글 추가 완료!\n");

    // MCP 툴로 조회하는 방법 안내
    console.log("💡 MCP 툴로 댓글 조회:");
    console.log(`   sql_select_comments_by_set({ userProblemSetId: ${userProblemSetId} })`);
    console.log(`   comment_get_all_by_set_with_sql({ userProblemSetId: ${userProblemSetId} })\n`);

  } catch (error: any) {
    console.error("\n❌ 에러 발생:", error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

addComment();

