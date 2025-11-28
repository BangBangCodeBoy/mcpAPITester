// userProblemToolsWithSql.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";
import { ApiSqlMapper } from "../sqlTools/apiSqlMapper.js";
import type { Pool } from "mysql2/promise";

const BACKEND_BASE_URL = "http://localhost:8080";

/**
 * UserProblem 관련 MCP 툴들 (API + SQL 자동 실행)
 */
export function registerUserProblemToolsWithSql(server: McpServer, pool: Pool) {
  const apiSqlMapper = new ApiSqlMapper(pool);

  // 1. GET /api/user-problems/sets/{userProblemSetId} - 문제 조회 (API + SQL)
  server.tool(
    "user_problem_get_by_set_with_sql",
    {
      userProblemSetId: z.number().describe("조회할 문제세트 ID"),
    },
    async ({ userProblemSetId }) => {
      try {
        const res = await axios.request({
          method: "GET",
          url: `${BACKEND_BASE_URL}/api/user-problems/sets/${userProblemSetId}`,
        });

        const sqlResult = await apiSqlMapper.executeUserProblemSql(
          "user_problem_get_by_set",
          { userProblemSetId }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  api: {
                    endpoint: `GET /api/user-problems/sets/${userProblemSetId}`,
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
              text:
                "user_problem_get_by_set_with_sql 실행 중 에러:\n" +
                (err?.response?.data
                  ? JSON.stringify(err.response.data, null, 2)
                  : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 2. POST /api/user-problems/sets/{userProblemSetId} - 문제 일괄 등록 (API + SQL)
  server.tool(
    "user_problem_create_bulk_with_sql",
    {
      userProblemSetId: z.number().describe("문제를 등록할 문제세트 ID"),
      userProblems: z
        .array(
          z.object({
            problemDescription: z.string().describe("문제 설명"),
            category: z.string().describe("문제 카테고리"),
            choice1: z.string().describe("선택지 1"),
            choice2: z.string().describe("선택지 2"),
            choice3: z.string().describe("선택지 3"),
            choice4: z.string().describe("선택지 4"),
            answer: z.string().describe("정답"),
          })
        )
        .describe("등록할 문제 목록"),
    },
    async ({ userProblemSetId, userProblems }) => {
      try {
        const res = await axios.request({
          method: "POST",
          url: `${BACKEND_BASE_URL}/api/user-problems/sets/${userProblemSetId}`,
          data: userProblems,
        });

        const sqlResult = await apiSqlMapper.executeUserProblemSql(
          "user_problem_create_bulk",
          { userProblemSetId, userProblems }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  api: {
                    endpoint: `POST /api/user-problems/sets/${userProblemSetId}`,
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
              text:
                "user_problem_create_bulk_with_sql 실행 중 에러:\n" +
                (err?.response?.data
                  ? JSON.stringify(err.response.data, null, 2)
                  : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 3. PUT /api/user-problems/{userProblemId} - 문제 수정 (API + SQL)
  server.tool(
    "user_problem_update_with_sql",
    {
      userProblemId: z.number().describe("수정할 문제 ID"),
      userProblem: z
        .object({
          problemDescription: z.string().describe("문제 설명"),
          category: z.string().describe("문제 카테고리"),
          choice1: z.string().describe("선택지 1"),
          choice2: z.string().describe("선택지 2"),
          choice3: z.string().describe("선택지 3"),
          choice4: z.string().describe("선택지 4"),
          answer: z.string().describe("정답"),
        })
        .describe("수정할 문제 정보"),
    },
    async ({ userProblemId, userProblem }) => {
      try {
        const res = await axios.request({
          method: "PUT",
          url: `${BACKEND_BASE_URL}/api/user-problems/${userProblemId}`,
          data: userProblem,
        });

        const sqlResult = await apiSqlMapper.executeUserProblemSql(
          "user_problem_update",
          { userProblemId, userProblem }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  api: {
                    endpoint: `PUT /api/user-problems/${userProblemId}`,
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
              text:
                "user_problem_update_with_sql 실행 중 에러:\n" +
                (err?.response?.data
                  ? JSON.stringify(err.response.data, null, 2)
                  : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 4. DELETE /api/user-problems/{userProblemId} - 문제 삭제 (API + SQL)
  server.tool(
    "user_problem_delete_with_sql",
    {
      userProblemId: z.number().describe("삭제할 문제 ID"),
    },
    async ({ userProblemId }) => {
      try {
        const res = await axios.request({
          method: "DELETE",
          url: `${BACKEND_BASE_URL}/api/user-problems/${userProblemId}`,
        });

        const sqlResult = await apiSqlMapper.executeUserProblemSql(
          "user_problem_delete",
          { userProblemId }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  api: {
                    endpoint: `DELETE /api/user-problems/${userProblemId}`,
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
              text:
                "user_problem_delete_with_sql 실행 중 에러:\n" +
                (err?.response?.data
                  ? JSON.stringify(err.response.data, null, 2)
                  : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );
}

