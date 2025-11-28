// testDirectSQL.ts
// MyBatis 우회하고 직접 SQL로 테스트

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "bang_user",
  password: "bang_password",
  database: "board_test",
});

async function testDirectSQL() {
  console.log("🗄️  직접 SQL로 데이터 확인\n");
  console.log("=" .repeat(70));

  try {
    // 1. 문제세트 확인
    console.log("\n📦 문제세트 목록:");
    const [sets] = await pool.query("SELECT * FROM user_problem_set") as any;
    console.log(`   총 ${sets.length}개`);
    sets.forEach((set: any) => {
      console.log(`   - ID: ${set.user_problem_set_id}, member_id: ${set.member_id}`);
    });

    // 2. 문제 확인
    console.log("\n📝 문제 목록 (문제세트 ID 1):");
    const [problems] = await pool.query(
      "SELECT user_problem_id, problem_description, category, answer FROM user_problem WHERE user_problem_set_id = 1"
    ) as any;
    console.log(`   총 ${problems.length}개`);
    problems.forEach((p: any) => {
      console.log(`   - [ID: ${p.user_problem_id}] ${p.problem_description.substring(0, 40)}...`);
      console.log(`     카테고리: ${p.category}, 정답: ${p.answer}번`);
    });

    // 3. 댓글 확인
    console.log("\n💬 댓글 목록 (문제세트 ID 1):");
    const [comments] = await pool.query(
      "SELECT * FROM comment WHERE user_problem_set_id = 1"
    ) as any;
    console.log(`   총 ${comments.length}개`);
    if (comments.length > 0) {
      comments.forEach((c: any) => {
        console.log(`   - [ID: ${c.comment_id}] ${c.content}`);
        console.log(`     작성자: ${c.member_id}, 날짜: ${c.comment_date}`);
      });
    } else {
      console.log(`   댓글이 없습니다.`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("\n✅ DB 데이터는 정상적으로 존재합니다!");
    console.log("\n⚠️  문제: MyBatis Mapper 설정 에러");
    console.log("   - MemberDao.memberResultMap이 정의되지 않음");
    console.log("   - CommentMapper.xml에서 memberResultMap을 참조하고 있음");
    console.log("\n💡 해결 방법:");
    console.log("   1. MemberMapper.xml 파일 생성");
    console.log("   2. memberResultMap 정의 추가");
    console.log("   3. 또는 CommentMapper.xml에서 resultMap 대신 resultType 사용\n");

  } catch (error: any) {
    console.error("❌ 에러:", error.message);
  } finally {
    await pool.end();
  }
}

testDirectSQL();

