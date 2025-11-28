// userProblemSetTools.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

const BACKEND_BASE_URL = "http://localhost:8080";

/**
 * UserProblemSet 관련 MCP 툴들을 등록하는 함수
 */
export function registerUserProblemSetTools(server: McpServer) {
  
  // 1. GET /api/user-problem-sets - 모든 문제세트 조회
  server.tool(
    "user_problem_set_get_all",
    {},
    async () => {
      try {
        const res = await axios.request({
          method: "GET",
          url: `${BACKEND_BASE_URL}/api/user-problem-sets`,
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
              text:
                "user_problem_set_get_all 툴 실행 중 에러:\n" +
                (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 2. GET /api/user-problem-sets/me - 내가 만든 문제세트 조회
  server.tool(
    "user_problem_set_get_my",
    {},
    async () => {
      try {
        const res = await axios.request({
          method: "GET",
          url: `${BACKEND_BASE_URL}/api/user-problem-sets/me`,
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
              text:
                "user_problem_set_get_my 툴 실행 중 에러:\n" +
                (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 3. POST /api/user-problem-sets - 문제세트 생성
  server.tool(
    "user_problem_set_create",
    {},
    async () => {
      try {
        const res = await axios.request({
          method: "POST",
          url: `${BACKEND_BASE_URL}/api/user-problem-sets`,
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
              text:
                "user_problem_set_create 툴 실행 중 에러:\n" +
                (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );

  // 4. DELETE /api/user-problem-sets/{userProblemSetId} - 문제세트 삭제
  server.tool(
    "user_problem_set_delete",
    {
      userProblemSetId: z.number().describe("삭제할 문제세트 ID"),
    },
    async ({ userProblemSetId }) => {
      try {
        const res = await axios.request({
          method: "DELETE",
          url: `${BACKEND_BASE_URL}/api/user-problem-sets/${userProblemSetId}`,
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
              text:
                "user_problem_set_delete 툴 실행 중 에러:\n" +
                (err?.response?.data ? JSON.stringify(err.response.data, null, 2) : err?.message || String(err)),
            },
          ],
        };
      }
    }
  );
}


