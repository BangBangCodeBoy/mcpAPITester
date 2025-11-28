// userProblemSqlTools.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Pool } from "mysql2/promise";

/**
 * UserProblem 관련 SQL 쿼리 툴들을 등록하는 함수
 * Mapper.xml 기반으로 생성됨
 */
export function registerUserProblemSqlTools(server: McpServer, pool: Pool) {
  
  // 1. selectProblemsByUserProblemSetId - 문제세트의 문제들 조회
  server.tool(
    "sql_select_problems_by_set",
    {
      userProblemSetId: z.number().describe("조회할 문제세트 ID"),
    },
    async ({ userProblemSetId }) => {
      try {
        const sql = `
          SELECT *
          FROM user_problem
          WHERE user_problem_set_id = ?
        `;
        
        const [rows] = await pool.query(sql, [userProblemSetId]) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "selectProblemsByUserProblemSetId",
                  sql: sql.trim(),
                  params: { userProblemSetId },
                  result: rows,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: "text",
              text:
                "sql_select_problems_by_set 실행 중 에러:\n" +
                (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 2. insertUserProblemList - 문제 일괄 등록
  server.tool(
    "sql_insert_user_problems",
    {
      userProblems: z.array(
        z.object({
          problemDescription: z.string().describe("문제 설명"),
          category: z.string().describe("문제 카테고리"),
          choice1: z.string().describe("선택지 1"),
          choice2: z.string().describe("선택지 2"),
          choice3: z.string().describe("선택지 3"),
          choice4: z.string().describe("선택지 4"),
          answer: z.string().describe("정답"),
          commentCount: z.number().optional().describe("댓글 수 (기본값 0)"),
          userProblemSetId: z.number().describe("문제세트 ID"),
        })
      ).describe("등록할 문제 목록"),
    },
    async ({ userProblems }) => {
      try {
        // MyBatis foreach와 동일한 로직으로 구현
        const values = userProblems.map(p => [
          p.problemDescription,
          p.category,
          p.choice1,
          p.choice2,
          p.choice3,
          p.choice4,
          p.answer,
          p.commentCount || 0,
          p.userProblemSetId
        ]);

        const sql = `
          INSERT INTO user_problem
          (problem_description, category, choice_1, choice_2, choice_3, choice_4, answer, comment_count, user_problem_set_id)
          VALUES ?
        `;
        
        const [result] = await pool.query(sql, [values]) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "insertUserProblemList",
                  sql: sql.trim(),
                  params: { userProblems },
                  result: result,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: "text",
              text:
                "sql_insert_user_problems 실행 중 에러:\n" +
                (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 3. updateUserProblem - 문제 수정
  server.tool(
    "sql_update_user_problem",
    {
      userProblemId: z.number().describe("수정할 문제 ID"),
      problemDescription: z.string().describe("문제 설명"),
      category: z.string().describe("문제 카테고리"),
      choice1: z.string().describe("선택지 1"),
      choice2: z.string().describe("선택지 2"),
      choice3: z.string().describe("선택지 3"),
      choice4: z.string().describe("선택지 4"),
      answer: z.string().describe("정답"),
      commentCount: z.number().optional().describe("댓글 수"),
    },
    async ({ userProblemId, problemDescription, category, choice1, choice2, choice3, choice4, answer, commentCount }) => {
      try {
        const sql = `
          UPDATE user_problem
          SET problem_description = ?,
              category = ?,
              choice_1 = ?,
              choice_2 = ?,
              choice_3 = ?,
              choice_4 = ?,
              answer = ?,
              comment_count = ?
          WHERE user_problem_id = ?
        `;
        
        const [result] = await pool.query(sql, [
          problemDescription,
          category,
          choice1,
          choice2,
          choice3,
          choice4,
          answer,
          commentCount || 0,
          userProblemId
        ]) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "updateUserProblem",
                  sql: sql.trim(),
                  params: { userProblemId, problemDescription, category, choice1, choice2, choice3, choice4, answer, commentCount },
                  result: result,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: "text",
              text:
                "sql_update_user_problem 실행 중 에러:\n" +
                (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 4. deleteUserProblemById - 문제 삭제
  server.tool(
    "sql_delete_user_problem",
    {
      userProblemId: z.number().describe("삭제할 문제 ID"),
    },
    async ({ userProblemId }) => {
      try {
        const sql = `
          DELETE FROM user_problem
          WHERE user_problem_id = ?
        `;
        
        const [result] = await pool.query(sql, [userProblemId]) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "deleteUserProblemById",
                  sql: sql.trim(),
                  params: { userProblemId },
                  result: result,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: "text",
              text:
                "sql_delete_user_problem 실행 중 에러:\n" +
                (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );
}

