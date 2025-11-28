// commentToolsWithSql.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";
import { ApiSqlMapper } from "../sqlTools/apiSqlMapper.js";
import type { Pool } from "mysql2/promise";

const BACKEND_BASE_URL = "http://localhost:8080";

/**
 * Comment 관련 MCP 툴들 (API + SQL 자동 실행)
 */
export function registerCommentToolsWithSql(server: McpServer, pool: Pool) {
  const apiSqlMapper = new ApiSqlMapper(pool);

  // 1. GET /api/comments/{userProblemSetId} - 댓글 조회 (API + SQL)
  server.tool(
    "comment_get_all_by_set_with_sql",
    {
      userProblemSetId: z.number().describe("조회할 문제세트 ID"),
    },
    async ({ userProblemSetId }) => {
      try {
        // 1) API 호출
        const res = await axios.request({
          method: "GET",
          url: `${BACKEND_BASE_URL}/api/comments/${userProblemSetId}`,
        });

        // 2) 매칭되는 SQL 자동 실행
        const sqlResult = await apiSqlMapper.executeCommentSql("comment_get_all_by_set", { userProblemSetId });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  api: {
                    endpoint: `GET /api/comments/${userProblemSetId}`,
                    status: res.status,
                    response: res.data,
                  },
                  sql: sqlResult,
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
              text: "comment_get_all_by_set_with_sql 실행 중 에러:\n" + (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 2. POST /api/comments/{userProblemSetId} - 댓글 추가 (API + SQL)
  server.tool(
    "comment_add_with_sql",
    {
      userProblemSetId: z.number().describe("댓글을 추가할 문제세트 ID"),
      comment: z
        .object({
          memberId: z.number().describe("작성자 회원 ID"),
          content: z.string().describe("댓글 내용"),
        })
        .describe("댓글 정보"),
    },
    async ({ userProblemSetId, comment }) => {
      try {
        // 1) API 호출
        const res = await axios.request({
          method: "POST",
          url: `${BACKEND_BASE_URL}/api/comments/${userProblemSetId}`,
          data: comment,
        });

        // 2) 매칭되는 SQL 자동 실행
        const sqlResult = await apiSqlMapper.executeCommentSql("comment_add", {
          userProblemSetId,
          comment,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  api: {
                    endpoint: `POST /api/comments/${userProblemSetId}`,
                    status: res.status,
                    response: res.data,
                  },
                  sql: sqlResult,
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
              text: "comment_add_with_sql 실행 중 에러:\n" + (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 3. PATCH /api/comments/{userProblemSetId}/{commentId} - 댓글 수정 (API + SQL)
  server.tool(
    "comment_update_with_sql",
    {
      userProblemSetId: z.number().describe("문제세트 ID"),
      commentId: z.number().describe("수정할 댓글 ID"),
      updateRequest: z
        .object({
          content: z.string().describe("수정할 댓글 내용"),
          memberId: z.number().describe("작성자 회원 ID (권한 확인용)"),
        })
        .describe("댓글 수정 요청 정보"),
    },
    async ({ userProblemSetId, commentId, updateRequest }) => {
      try {
        // 1) API 호출
        const res = await axios.request({
          method: "PATCH",
          url: `${BACKEND_BASE_URL}/api/comments/${userProblemSetId}/${commentId}`,
          data: updateRequest,
        });

        // 2) 매칭되는 SQL 자동 실행
        const sqlResult = await apiSqlMapper.executeCommentSql("comment_update", {
          userProblemSetId,
          commentId,
          updateRequest,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  api: {
                    endpoint: `PATCH /api/comments/${userProblemSetId}/${commentId}`,
                    status: res.status,
                    response: res.data,
                  },
                  sql: sqlResult,
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
              text: "comment_update_with_sql 실행 중 에러:\n" + (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 4. DELETE /api/comments/{userProblemSetId}/{commentId} - 댓글 삭제 (API + SQL)
  server.tool(
    "comment_delete_with_sql",
    {
      userProblemSetId: z.number().describe("문제세트 ID"),
      commentId: z.number().describe("삭제할 댓글 ID"),
    },
    async ({ userProblemSetId, commentId }) => {
      try {
        // 1) API 호출
        const res = await axios.request({
          method: "DELETE",
          url: `${BACKEND_BASE_URL}/api/comments/${userProblemSetId}/${commentId}`,
        });

        // 2) 매칭되는 SQL 자동 실행
        const sqlResult = await apiSqlMapper.executeCommentSql("comment_delete", {
          userProblemSetId,
          commentId,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  api: {
                    endpoint: `DELETE /api/comments/${userProblemSetId}/${commentId}`,
                    status: res.status,
                    response: res.data,
                  },
                  sql: sqlResult,
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
              text: "comment_delete_with_sql 실행 중 에러:\n" + (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );
}
