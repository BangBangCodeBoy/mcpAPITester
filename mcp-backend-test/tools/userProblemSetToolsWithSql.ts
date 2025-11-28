// userProblemSetToolsWithSql.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";
import { ApiSqlMapper } from "../sqlTools/apiSqlMapper.js";
import type { Pool } from "mysql2/promise";

const BACKEND_BASE_URL = "http://localhost:8080";

/**
 * UserProblemSet 관련 MCP 툴들 (API + SQL 자동 실행)
 */
export function registerUserProblemSetToolsWithSql(
  server: McpServer,
  pool: Pool
) {
  const apiSqlMapper = new ApiSqlMapper(pool);

  // 1. GET /api/user-problem-sets - 모든 문제세트 조회 (API + SQL)
  server.tool("user_problem_set_get_all_with_sql", {}, async () => {
    try {
      const res = await axios.request({
        method: "GET",
        url: `${BACKEND_BASE_URL}/api/user-problem-sets`,
      });

      const sqlResult = await apiSqlMapper.executeUserProblemSetSql(
        "user_problem_set_get_all",
        {}
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                api: {
                  endpoint: "GET /api/user-problem-sets",
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
              "user_problem_set_get_all_with_sql 실행 중 에러:\n" +
              (err?.response?.data
                ? JSON.stringify(err.response.data, null, 2)
                : err?.message || String(err)),
          },
        ],
      };
    }
  });

  // 2. GET /api/user-problem-sets/me - 내 문제세트 조회 (API + SQL)
  server.tool(
    "user_problem_set_get_my_with_sql",
    {
      memberId: z.number().describe("회원 ID (세션에서 가져온 값)"),
    },
    async ({ memberId }) => {
      try {
        const res = await axios.request({
          method: "GET",
          url: `${BACKEND_BASE_URL}/api/user-problem-sets/me`,
        });

        const sqlResult = await apiSqlMapper.executeUserProblemSetSql(
          "user_problem_set_get_my",
          { memberId }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  api: {
                    endpoint: "GET /api/user-problem-sets/me",
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
                "user_problem_set_get_my_with_sql 실행 중 에러:\n" +
                (err?.response?.data
                  ? JSON.stringify(err.response.data, null, 2)
                  : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 3. POST /api/user-problem-sets - 문제세트 생성 (API + SQL)
  server.tool(
    "user_problem_set_create_with_sql",
    {
      memberId: z.number().describe("회원 ID (세션에서 가져온 값)"),
    },
    async ({ memberId }) => {
      try {
        const res = await axios.request({
          method: "POST",
          url: `${BACKEND_BASE_URL}/api/user-problem-sets`,
        });

        const sqlResult = await apiSqlMapper.executeUserProblemSetSql(
          "user_problem_set_create",
          { memberId }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  api: {
                    endpoint: "POST /api/user-problem-sets",
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
                "user_problem_set_create_with_sql 실행 중 에러:\n" +
                (err?.response?.data
                  ? JSON.stringify(err.response.data, null, 2)
                  : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 4. DELETE /api/user-problem-sets/{userProblemSetId} - 문제세트 삭제 (API + SQL)
  server.tool(
    "user_problem_set_delete_with_sql",
    {
      userProblemSetId: z.number().describe("삭제할 문제세트 ID"),
    },
    async ({ userProblemSetId }) => {
      try {
        const res = await axios.request({
          method: "DELETE",
          url: `${BACKEND_BASE_URL}/api/user-problem-sets/${userProblemSetId}`,
        });

        const sqlResult = await apiSqlMapper.executeUserProblemSetSql(
          "user_problem_set_delete",
          { userProblemSetId }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  api: {
                    endpoint: `DELETE /api/user-problem-sets/${userProblemSetId}`,
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
                "user_problem_set_delete_with_sql 실행 중 에러:\n" +
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

