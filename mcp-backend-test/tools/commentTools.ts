// commentTools.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";
import { ApiSqlMapper } from "../sqlTools/apiSqlMapper.js";
import mysql from "mysql2/promise";

const BACKEND_BASE_URL = "http://localhost:8080";

/**
 * Comment 관련 MCP 툴들을 등록하는 함수
 */
export function registerCommentTools(server: McpServer, pool?: mysql.Pool) {
  const apiSqlMapper = pool ? new ApiSqlMapper(pool) : null;
  // 1. GET /api/comments/{userProblemSetId} - 특정 문제세트의 모든 댓글 조회
  server.tool(
    "comment_get_all_by_set",
    {
      userProblemSetId: z.number().describe("조회할 문제세트 ID"),
    },
    async ({ userProblemSetId }) => {
      try {
        const res = await axios.request({
          method: "GET",
          url: `${BACKEND_BASE_URL}/api/comments/${userProblemSetId}`,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  status: res.status,
                  body: res.data,
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
              text: "comment_get_all_by_set 툴 실행 중 에러:\n" + (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 2. POST /api/comments/{userProblemSetId} - 댓글 추가
  server.tool(
    "comment_add",
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
        const res = await axios.request({
          method: "POST",
          url: `${BACKEND_BASE_URL}/api/comments/${userProblemSetId}`,
          data: comment,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  status: res.status,
                  body: res.data,
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
              text: "comment_add 툴 실행 중 에러:\n" + (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 3. PATCH /api/comments/{userProblemSetId}/{commentId} - 댓글 수정
  server.tool(
    "comment_update",
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
        const res = await axios.request({
          method: "PATCH",
          url: `${BACKEND_BASE_URL}/api/comments/${userProblemSetId}/${commentId}`,
          data: updateRequest,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  status: res.status,
                  body: res.data,
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
              text: "comment_update 툴 실행 중 에러:\n" + (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 4. DELETE /api/comments/{userProblemSetId}/{commentId} - 댓글 삭제
  server.tool(
    "comment_delete",
    {
      userProblemSetId: z.number().describe("문제세트 ID"),
      commentId: z.number().describe("삭제할 댓글 ID"),
    },
    async ({ userProblemSetId, commentId }) => {
      try {
        const res = await axios.request({
          method: "DELETE",
          url: `${BACKEND_BASE_URL}/api/comments/${userProblemSetId}/${commentId}`,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  status: res.status,
                  body: res.data,
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
              text: "comment_delete 툴 실행 중 에러:\n" + (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );
}
