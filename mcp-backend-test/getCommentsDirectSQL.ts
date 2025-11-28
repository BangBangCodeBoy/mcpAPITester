// getCommentsDirectSQL.ts
// SQL로 직접 댓글 조회

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "bang_user",
  password: "bang_password",
  database: "board_test",
});

async function getCommentsDirectSQL() {
  const userProblemSetId = 1;

  console.log("💬 문제세트 ID 1의 댓글 조회 (SQL 직접)\n");
  console.log("=" .repeat(70));

  try {
    console.log(`\n🗄️  SQL 쿼리 실행:`);
    console.log(`   SELECT * FROM comment WHERE user_problem_set_id = ${userProblemSetId}\n`);

    const [comments] = await pool.query(
      "SELECT * FROM comment WHERE user_problem_set_id = ? ORDER BY comment_date DESC",
      [userProblemSetId]
    ) as any;

    console.log(`✅ 조회 성공!`);
    console.log(`\n💬 문제세트 ID ${userProblemSetId}의 댓글 (총 ${comments.length}개):\n`);

    if (comments.length === 0) {
      console.log("   댓글이 없습니다.\n");
    } else {
      comments.forEach((comment: any, index: number) => {
        console.log(`${index + 1}. [댓글 ID: ${comment.comment_id}]`);
        console.log(`   작성자: member_id ${comment.member_id}`);
        console.log(`   내용: ${comment.content}`);
        console.log(`   작성일: ${new Date(comment.comment_date).toLocaleString('ko-KR')}`);
        console.log();
      });
    }

    console.log("=" .repeat(70));
    console.log("\n⚠️  API 에러 원인:");
    console.log("   CommentMapper.xml의 문제:");
    console.log("   1. ID 불일치: selectCommentsByuserProblemSetId vs selectAllByUserProblemSetId");
    console.log("   2. 컬럼명 오류: user_problem_id → user_problem_set_id");
    console.log("\n💡 해결 방법:");
    console.log("   CommentMapper.xml 수정 필요:");
    console.log("   <select id=\"selectCommentsByuserProblemSetId\" resultType=\"Comment\">");
    console.log("     SELECT * FROM comment WHERE user_problem_set_id = #{userProblemSetId}");
    console.log("   </select>\n");

  } catch (error: any) {
    console.error("❌ 에러:", error.message);
  } finally {
    await pool.end();
  }
}

getCommentsDirectSQL();

