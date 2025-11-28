// userProblemSetSqlTools.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Pool } from "mysql2/promise";

/**
 * UserProblemSet 관련 SQL 쿼리 툴들을 등록하는 함수
 * Mapper.xml 기반으로 생성됨
 */
export function registerUserProblemSetSqlTools(server: McpServer, pool: Pool) {
  
  // 1. selectUserProblemSets - 모든 문제세트 조회
  server.tool(
    "sql_select_all_problem_sets",
    {},
    async () => {
      try {
        const sql = `
          SELECT *
          FROM user_problem_set
        `;
        
        const [rows] = await pool.query(sql) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "selectUserProblemSets",
                  sql: sql.trim(),
                  params: {},
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
                "sql_select_all_problem_sets 실행 중 에러:\n" +
                (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 2. selectUserProblemSetByMemberId - 회원 ID로 문제세트 조회
  server.tool(
    "sql_select_problem_set_by_member",
    {
      memberId: z.number().describe("회원 ID"),
    },
    async ({ memberId }) => {
      try {
        const sql = `
          SELECT *
          FROM user_problem_set
          WHERE member_id = ?
        `;
        
        const [rows] = await pool.query(sql, [memberId]) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "selectUserProblemSetByMemberId",
                  sql: sql.trim(),
                  params: { memberId },
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
                "sql_select_problem_set_by_member 실행 중 에러:\n" +
                (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 3. insertUserProblemSet - 문제세트 등록
  server.tool(
    "sql_insert_problem_set",
    {
      memberId: z.number().describe("회원 ID (문제 제작자)"),
    },
    async ({ memberId }) => {
      try {
        const sql = `
          INSERT INTO user_problem_set (member_id)
          VALUES (?)
        `;
        
        const [result] = await pool.query(sql, [memberId]) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "insertUserProblemSet",
                  sql: sql.trim(),
                  params: { memberId },
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
                "sql_insert_problem_set 실행 중 에러:\n" +
                (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 4. deleteUserProblemSetById - 문제세트 삭제
  server.tool(
    "sql_delete_problem_set",
    {
      userProblemSetId: z.number().describe("삭제할 문제세트 ID"),
    },
    async ({ userProblemSetId }) => {
      try {
        const sql = `
          DELETE FROM user_problem_set
          WHERE user_problem_set_id = ?
        `;
        
        const [result] = await pool.query(sql, [userProblemSetId]) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "deleteUserProblemSetById",
                  sql: sql.trim(),
                  params: { userProblemSetId },
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
                "sql_delete_problem_set 실행 중 에러:\n" +
                (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );
}

