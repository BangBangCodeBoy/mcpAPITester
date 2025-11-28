// commentSqlTools.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Pool } from "mysql2/promise";

/**
 * Comment 관련 SQL 쿼리 툴들을 등록하는 함수
 * Mapper.xml 기반으로 생성됨
 */
export function registerCommentSqlTools(server: McpServer, pool: Pool) {
  const poolAny = pool as any;

  // 1. selectCommentsByuserProblemSetId - 댓글 조회
  server.tool(
    "sql_select_comments_by_set",
    {
      userProblemSetId: z.number().describe("조회할 문제세트 ID"),
    },
    async ({ userProblemSetId }) => {
      try {
        const sql = `
          SELECT *
          FROM comment
          WHERE user_problem_set_id = ?
        `;

        const [rows] = (await poolAny.query(sql, [userProblemSetId])) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "selectCommentsByuserProblemSetId",
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
              text: "sql_select_comments_by_set 실행 중 에러:\n" + (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 2. insertComment - 댓글 추가
  server.tool(
    "sql_insert_comment",
    {
      userProblemSetId: z.number().describe("문제세트 ID"),
      memberId: z.number().describe("작성자 회원 ID"),
      content: z.string().describe("댓글 내용"),
    },
    async ({ userProblemSetId, memberId, content }) => {
      try {
        const commentDate = new Date();
        const sql = `
          INSERT INTO comment (member_id, content, comment_date, user_problem_set_id)
          VALUES (?, ?, ?, ?)
        `;

        const [result] = (await poolAny.query(sql, [memberId, content, commentDate, userProblemSetId])) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "insertComment",
                  sql: sql.trim(),
                  params: { memberId, content, commentDate, userProblemSetId },
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
              text: "sql_insert_comment 실행 중 에러:\n" + (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 3. updateComment - 댓글 수정
  server.tool(
    "sql_update_comment",
    {
      commentId: z.number().describe("수정할 댓글 ID"),
      content: z.string().describe("수정할 내용"),
    },
    async ({ commentId, content }) => {
      try {
        const sql = `
          UPDATE comment
          SET content = ?
          WHERE comment_id = ?
        `;

        const [result] = (await poolAny.query(sql, [content, commentId])) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "updateComment",
                  sql: sql.trim(),
                  params: { commentId, content },
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
              text: "sql_update_comment 실행 중 에러:\n" + (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 4. deleteComment - 댓글 삭제
  server.tool(
    "sql_delete_comment",
    {
      commentId: z.number().describe("삭제할 댓글 ID"),
    },
    async ({ commentId }) => {
      try {
        const sql = `
          DELETE FROM comment
          WHERE comment_id = ?
        `;

        const [result] = (await poolAny.query(sql, [commentId])) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "deleteComment",
                  sql: sql.trim(),
                  params: { commentId },
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
              text: "sql_delete_comment 실행 중 에러:\n" + (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 5. selectCommentOwnerId - 댓글 작성자 ID 조회
  server.tool(
    "sql_select_comment_owner",
    {
      commentId: z.number().describe("댓글 ID"),
    },
    async ({ commentId }) => {
      try {
        const sql = `
          SELECT member_id
          FROM comment
          WHERE comment_id = ?
        `;

        const [rows] = (await poolAny.query(sql, [commentId])) as any;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: "selectCommentOwnerId",
                  sql: sql.trim(),
                  params: { commentId },
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
              text: "sql_select_comment_owner 실행 중 에러:\n" + (err?.message || String(err)),
            },
          ],
        };
      }
    }
  );
}
