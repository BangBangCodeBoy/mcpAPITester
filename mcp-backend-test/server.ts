// server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

// 1) MCP 서버 인스턴스 생성
const server = new McpServer({
    name: "bangbang-backend-test",
    version: "1.0.0",
});

// 2) "로그인 + 프로필 조회" 시나리오 도구 등록
server.tool(
    "run_login_and_get_profile",
    {
        // 이 도구가 받을 입력 스키마 정의 (zod)
        loginId: z.string(),
        password: z.string(),
    },
    async ({ loginId, password }) => {
        try {
            // 1) 로그인 요청
            const loginRes = await axios.post(
                "http://localhost:8080/api/members/login",
                {
                    loginId,
                    password,
                }
            );

            // 네 프로젝트 응답 형태에 맞게 수정해야 함
            const token = loginRes.data.token;
            if (!token) {
                throw new Error("로그인 응답에 token이 없습니다.");
            }

            // 2) 프로필 조회 요청
            const meRes = await axios.get(
                "http://localhost:8080/api/members/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // MCP는 이런 형태로 텍스트/JSON을 리턴
            const result = {
                loginStatus: loginRes.status,
                loginBody: loginRes.data,
                meStatus: meRes.status,
                meBody: meRes.data,
            };

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        } catch (err: any) {
            // 에러도 텍스트로 돌려주기
            return {
                content: [
                    {
                        type: "text",
                        text:
                            "시나리오 실행 중 에러 발생:\n" +
                            (err?.message || String(err)),
                    },
                ],
            };
        }
    }
);

// 3) stdio 기반으로 Cursor와 연결
const transport = new StdioServerTransport();
await server.connect(transport);
