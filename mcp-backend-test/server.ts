// server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import mysql from "mysql2/promise";
import { registerAllTools, registerAllToolsWithSql } from "./tools/index.js";
import { registerAllSqlTools } from "./sqlTools/index.js";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "bang_user",
  password: "bang_password",
  database: "board_test",
});

// 1) MCP 서버 인스턴스 생성
const server = new McpServer({
  name: "bangbang-backend-test",
  version: "1.0.0",
});

// 2) "로그인 + 프로필 조회" 시나리오 도구 등록
server.tool(
  "login",
  {
    loginId: z.string(),
    password: z.string(),
  },
  async ({ loginId, password }) => {
    try {
      const res = await axios.post(`${BACKEND_BASE_URL}/api/members/login`, {
        loginId,
        password,
      });

      // ✅ 토큰을 뽑지 않고 응답 그대로 넘김
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
            text: "login 툴 실행 중 에러:\n" + (err?.message || String(err)),
          },
        ],
      };
    }
  }
);

// 2) "백엔드 API 호출" 도구 등록
const BACKEND_BASE_URL = "http://localhost:8081";
server.tool(
  "call_backend_api",
  {
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    path: z.string(), // 예: "/api/members/3"
    body: z.any().optional(), // POST/PUT일 때만 사용
  },
  async ({ method, path, body }) => {
    try {
      const url = `${BACKEND_BASE_URL}${path}`;

      const res = await axios.request({
        method,
        url,
        data: body,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                status: res.status,
                headers: res.headers,
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
            text: "call_backend_api 툴 실행 중 에러:\n" + (err?.message || String(err)),
          },
        ],
      };
    }
  }
);

server.tool(
  "run_sql_query",
  {
    sql: z.string(),
    params: z.array(z.any()).optional(),
  },
  async ({ sql, params }) => {
    try {
      const [rows] = await (pool as any).query(sql, params || []);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(rows, null, 2),
          },
        ],
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: "text",
            text: "run_sql_query 툴 실행 중 에러:\n" + (err?.message || String(err)),
          },
        ],
      };
    }
  }
);

// ✅ API 전용 툴들 등록 (API만 호출)
registerAllTools(server);

// ✅ API + SQL 통합 툴들 등록 (API 호출 + 매칭되는 SQL 자동 실행)
registerAllToolsWithSql(server, pool);

// ✅ SQL 전용 툴들 등록 (SQL만 직접 실행)
registerAllSqlTools(server, pool);

// 3) stdio 기반으로 Cursor와 연결
const transport = new StdioServerTransport();
await server.connect(transport);
