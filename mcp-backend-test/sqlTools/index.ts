// sqlTools/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Pool } from "mysql2/promise";
import { registerCommentSqlTools } from "./commentSqlTools.js";
import { registerUserProblemSqlTools } from "./userProblemSqlTools.js";
import { registerUserProblemSetSqlTools } from "./userProblemSetSqlTools.js";

/**
 * 모든 SQL 툴들을 MCP 서버에 등록하는 함수
 */
export function registerAllSqlTools(server: McpServer, pool: Pool) {
  // Comment SQL 툴 등록
  registerCommentSqlTools(server, pool);
  
  // UserProblem SQL 툴 등록
  registerUserProblemSqlTools(server, pool);
  
  // UserProblemSet SQL 툴 등록
  registerUserProblemSetSqlTools(server, pool);
}

// 개별 export도 제공
export { registerCommentSqlTools } from "./commentSqlTools.js";
export { registerUserProblemSqlTools } from "./userProblemSqlTools.js";
export { registerUserProblemSetSqlTools } from "./userProblemSetSqlTools.js";
export { ApiSqlMapper } from "./apiSqlMapper.js";

