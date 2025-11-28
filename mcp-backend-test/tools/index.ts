// tools/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Pool } from "mysql2/promise";
import { registerCommentTools } from "./commentTools.js";
import { registerUserProblemTools } from "./userProblemTools.js";
import { registerUserProblemSetTools } from "./userProblemSetTools.js";
import { registerCommentToolsWithSql } from "./commentToolsWithSql.js";
import { registerUserProblemToolsWithSql } from "./userProblemToolsWithSql.js";
import { registerUserProblemSetToolsWithSql } from "./userProblemSetToolsWithSql.js";

/**
 * 모든 API 툴들을 MCP 서버에 등록하는 함수
 */
export function registerAllTools(server: McpServer) {
  // Comment API 툴 등록
  registerCommentTools(server);
  
  // UserProblem API 툴 등록
  registerUserProblemTools(server);
  
  // UserProblemSet API 툴 등록
  registerUserProblemSetTools(server);
}

/**
 * API + SQL 통합 툴들을 MCP 서버에 등록하는 함수
 */
export function registerAllToolsWithSql(server: McpServer, pool: Pool) {
  // Comment API + SQL 툴 등록
  registerCommentToolsWithSql(server, pool);
  
  // UserProblem API + SQL 툴 등록
  registerUserProblemToolsWithSql(server, pool);
  
  // UserProblemSet API + SQL 툴 등록
  registerUserProblemSetToolsWithSql(server, pool);
}

// 개별 export도 제공
export { registerCommentTools } from "./commentTools.js";
export { registerUserProblemTools } from "./userProblemTools.js";
export { registerUserProblemSetTools } from "./userProblemSetTools.js";
export { registerCommentToolsWithSql } from "./commentToolsWithSql.js";
export { registerUserProblemToolsWithSql } from "./userProblemToolsWithSql.js";
export { registerUserProblemSetToolsWithSql } from "./userProblemSetToolsWithSql.js";
