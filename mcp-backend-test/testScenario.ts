// testScenario.ts
// testScenario.md의 시나리오에 따라 API 테스트

import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import * as fs from "fs";
import * as path from "path";
import * as mysql from "mysql2/promise";

const BACKEND_BASE_URL = "http://localhost:8080";

// 쿠키를 자동으로 관리하는 axios 인스턴스 생성
const jar = new CookieJar();
const client = wrapper(
    axios.create({
        jar,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    })
);

interface TestResult {
    step: number;
    name: string;
    method: string;
    url: string;
    status: number | null;
    success: boolean;
    message: string;
    response?: any;
    error?: any;
}

const results: TestResult[] = [];

async function testAPI(
    step: number,
    name: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    data?: any
): Promise<TestResult> {
    try {
        const response = await client.request({
            method,
            url: `${BACKEND_BASE_URL}${url}`,
            data,
        });

        const result: TestResult = {
            step,
            name,
            method,
            url,
            status: response.status,
            success: response.status >= 200 && response.status < 300,
            message: "성공",
            response: response.data,
        };

        results.push(result);
        return result;
    } catch (error: any) {
        const result: TestResult = {
            step,
            name,
            method,
            url,
            status: error.response?.status || null,
            success: false,
            message: error.response?.data?.message || error.message || "실패",
            error: error.response?.data || error.message,
        };

        results.push(result);
        return result;
    }
}

function printResult(result: TestResult) {
    const icon = result.success ? "✅" : "❌";
    console.log(`\n[${result.step}] ${icon} ${result.name}`);
    console.log(`   ${result.method} ${result.url}`);
    console.log(`   상태: ${result.status || "N/A"}`);
    console.log(`   메시지: ${result.message}`);
    if (result.response && result.success) {
        const responseStr = JSON.stringify(result.response, null, 2);
        if (responseStr.length > 200) {
            console.log(`   응답: ${responseStr.substring(0, 200)}...`);
        } else {
            console.log(`   응답:`, result.response);
        }
    }
    if (result.error && !result.success) {
        const errorStr =
            typeof result.error === "string"
                ? result.error
                : JSON.stringify(result.error, null, 2);
        if (errorStr.length > 200) {
            console.log(`   에러: ${errorStr.substring(0, 200)}...`);
        } else {
            console.log(`   에러: ${errorStr}`);
        }
    }
}

// 1. 모든 테이블의 데이터 삭제
async function deleteAllData() {
    console.log("\n[1] 🗑️  모든 테이블의 데이터 삭제");
    console.log("=".repeat(80));

    const configs = [
        {
            host: "localhost",
            user: "root",
            password: "1234",
            database: "board_test",
            multipleStatements: true,
        },
        {
            host: "localhost",
            user: "root",
            password: "",
            database: "board_test",
            multipleStatements: true,
        },
    ];

    let connection: mysql.Connection | null = null;
    for (const config of configs) {
        try {
            connection = await mysql.createConnection(config);
            console.log(`✅ DB 연결 성공 (${config.user})`);

            // 외래키 제약 해제
            await connection.query("SET FOREIGN_KEY_CHECKS = 0");

            // 테이블 데이터 삭제 (외래키 순서 고려)
            const deleteQueries = [
                "DELETE FROM incorrect_note",
                "DELETE FROM comment",
                "DELETE FROM user_problem",
                "DELETE FROM user_problem_set",
                "DELETE FROM quiz_room_member",
                "DELETE FROM quiz_room",
                "DELETE FROM user_score",
                "DELETE FROM problem",
                "DELETE FROM member",
            ];

            for (const query of deleteQueries) {
                const [result] = await connection.query(query);
                console.log(`   ✓ ${query}`);
            }

            // 외래키 제약 복구
            await connection.query("SET FOREIGN_KEY_CHECKS = 1");

            await connection.end();
            console.log("\n✅ 모든 테이블 데이터 삭제 완료!");
            return true;
        } catch (error: any) {
            if (connection) {
                await connection.end().catch(() => {});
            }
            console.log(`❌ ${config.user} 연결 실패: ${error.message}`);
        }
    }

    console.log("\n❌ DB 연결 실패 - 데이터 삭제를 건너뜁니다.");
    return false;
}

async function runTestScenario() {
    console.log("🚀 테스트 시나리오 실행");
    console.log("=".repeat(80));

    let loggedInMemberId: number | null = null;
    let userProblemSetId: number | null = null;
    let userProblemIds: number[] = [];
    let commentIds: number[] = [];
    let quizRoomId: number | null = null;
    let incorrectNoteId: number | null = null;
    let signupId: string = "";
    let signupPassword: string = "";

    // 1. 모든 테이블의 데이터 삭제
    await deleteAllData();

    // 2. 회원가입 + 해당 유저의 점수 등록
    console.log("\n\n[2] 👤 회원가입 + 점수 등록");
    console.log("=".repeat(80));

    const timeSuffix = Date.now().toString().slice(-6); // 마지막 6자리만 사용
    signupId = `test${timeSuffix}`;
    signupPassword = "testpass123";

    const signupResult = await testAPI(2, "회원가입", "POST", "/api/member", {
        id: signupId,
        password: signupPassword,
        nickname: "테스트유저",
        email: `test${timeSuffix}@test.com`,
    });
    printResult(signupResult);

    if (!signupResult.success) {
        console.log("\n   ❌ 회원가입 실패! 테스트를 중단합니다.");
        return;
    }

    console.log(`   📝 회원가입 성공!`);

    // 3. 로그인 (회원가입 후 바로 로그인하여 memberId 획득)
    console.log("\n\n[3] 🔐 로그인");
    console.log("=".repeat(80));

    const loginResult = await testAPI(3, "로그인", "POST", "/api/auth/login", {
        id: signupId,
        password: signupPassword,
    });
    printResult(loginResult);

    if (loginResult.success && loginResult.response?.data?.memberId) {
        loggedInMemberId = loginResult.response.data.memberId;
        console.log(`   📝 로그인 성공! 회원 ID: ${loggedInMemberId}`);

        // 2번 시나리오: 점수 등록
        console.log("\n[2-2] 점수 등록");
        const scoreResult = await testAPI(
            2,
            "점수 등록",
            "POST",
            "/api/scores",
            {
                score: 100,
            }
        );
        printResult(scoreResult);
    } else {
        console.log("\n   ❌ 로그인 실패! 테스트를 중단합니다.");
        return;
    }

    // 4. 문제세트 전체조회
    console.log("\n\n[4] 📦 문제세트 전체조회");
    console.log("=".repeat(80));
    await testAPI(4, "문제세트 전체조회", "GET", "/api/user-problem-sets").then(
        printResult
    );

    // 5. 로그인한 회원이 만든 유저제작문제세트 조회
    console.log("\n\n[5] 📦 내 문제세트 조회");
    console.log("=".repeat(80));
    const mySetResult = await testAPI(
        5,
        "내 문제세트 조회",
        "GET",
        "/api/user-problem-sets/me"
    );
    printResult(mySetResult);

    if (mySetResult.success && mySetResult.response?.data?.userProblemSetId) {
        userProblemSetId = mySetResult.response.data.userProblemSetId;
        console.log(`   📝 문제세트 ID: ${userProblemSetId}`);
    } else {
        // 문제세트가 없으면 생성
        console.log("\n   문제세트가 없어서 생성합니다.");
        const createSetResult = await testAPI(
            5,
            "문제세트 생성",
            "POST",
            "/api/user-problem-sets",
            undefined
        );
        printResult(createSetResult);

        const recheckResult = await testAPI(
            5,
            "내 문제세트 재조회",
            "GET",
            "/api/user-problem-sets/me"
        );
        if (
            recheckResult.success &&
            recheckResult.response?.data?.userProblemSetId
        ) {
            userProblemSetId = recheckResult.response.data.userProblemSetId;
            console.log(`   📝 생성된 문제세트 ID: ${userProblemSetId}`);
        }
    }

    // 6. 로그인한 회원이 유저제작문제 3개 추가
    console.log("\n\n[6] 📝 유저제작문제 3개 추가");
    console.log("=".repeat(80));

    if (userProblemSetId) {
        const addProblemsResult = await testAPI(
            6,
            "문제 일괄 등록",
            "POST",
            `/api/user-problems/sets/${userProblemSetId}`,
            [
                {
                    problemDescription: "시나리오 테스트 문제 1",
                    category: "INFOENGINEERING",
                    choice1: "선택지1",
                    choice2: "선택지2",
                    choice3: "선택지3",
                    choice4: "선택지4",
                    answer: "1",
                },
                {
                    problemDescription: "시나리오 테스트 문제 2",
                    category: "INFOENGINEERING",
                    choice1: "선택지A",
                    choice2: "선택지B",
                    choice3: "선택지C",
                    choice4: "선택지D",
                    answer: "2",
                },
                {
                    problemDescription: "시나리오 테스트 문제 3",
                    category: "SQLD",
                    choice1: "옵션1",
                    choice2: "옵션2",
                    choice3: "옵션3",
                    choice4: "옵션4",
                    answer: "3",
                },
            ]
        );
        printResult(addProblemsResult);

        // 문제 ID 수집
        const getProblemsResult = await testAPI(
            6,
            "문제 목록 조회",
            "GET",
            `/api/user-problems/sets/${userProblemSetId}`
        );
        if (getProblemsResult.success && getProblemsResult.response?.data) {
            userProblemIds = getProblemsResult.response.data
                .map((p: any) => p.userProblemId)
                .filter((id: number) => id !== undefined);
            console.log(`   📝 등록된 문제 ID: ${userProblemIds.join(", ")}`);
        }
    }

    // 7. 로그인한 회원이 유저제작문제 하나 수정
    console.log("\n\n[7] ✏️  유저제작문제 수정");
    console.log("=".repeat(80));

    if (userProblemIds.length > 0) {
        await testAPI(
            7,
            "문제 수정",
            "PUT",
            `/api/user-problems/${userProblemIds[0]}`,
            {
                problemDescription: "수정된 문제입니다!",
                category: "INFOENGINEERING",
                choice1: "수정1",
                choice2: "수정2",
                choice3: "수정3",
                choice4: "수정4",
                answer: "2",
            }
        ).then(printResult);
    }

    // 8. 유저제작 문제의 댓글 조회
    console.log("\n\n[8] 💬 댓글 조회");
    console.log("=".repeat(80));

    if (userProblemSetId) {
        const getCommentsResult = await testAPI(
            8,
            "댓글 조회",
            "GET",
            `/api/comments/${userProblemSetId}`
        );
        printResult(getCommentsResult);

        if (getCommentsResult.success && getCommentsResult.response?.data) {
            commentIds = getCommentsResult.response.data
                .map((c: any) => c.commentId)
                .filter((id: number) => id !== undefined);
        }
    }

    // 9. 로그인한 회원이 댓글 3개 작성
    console.log("\n\n[9] 💬 댓글 3개 작성");
    console.log("=".repeat(80));

    if (userProblemSetId) {
        for (let i = 1; i <= 3; i++) {
            await testAPI(
                9,
                `댓글 작성 ${i}`,
                "POST",
                `/api/comments/${userProblemSetId}`,
                {
                    content: `시나리오 테스트 댓글 ${i}입니다.`,
                }
            ).then(printResult);
        }

        // 댓글 ID 수집
        const recheckComments = await testAPI(
            9,
            "댓글 재조회",
            "GET",
            `/api/comments/${userProblemSetId}`
        );
        if (recheckComments.success && recheckComments.response?.data) {
            commentIds = recheckComments.response.data
                .map((c: any) => c.commentId)
                .filter((id: number) => id !== undefined);
        }
    }

    // 10. 로그인한 회원이 댓글 하나 수정
    console.log("\n\n[10] ✏️  댓글 수정");
    console.log("=".repeat(80));

    if (userProblemSetId && commentIds.length > 0) {
        await testAPI(
            10,
            "댓글 수정",
            "PATCH",
            `/api/comments/${userProblemSetId}/${commentIds[0]}`,
            {
                content: "수정된 댓글 내용입니다!",
            }
        ).then(printResult);
    }

    // 11. 로그인한 회원이 댓글 삭제
    console.log("\n\n[11] 🗑️  댓글 삭제");
    console.log("=".repeat(80));

    if (userProblemSetId && commentIds.length > 1) {
        await testAPI(
            11,
            "댓글 삭제",
            "DELETE",
            `/api/comments/${userProblemSetId}/${commentIds[1]}`
        ).then(printResult);
    }

    // 12. 로그인한 회원이 문제 세트 삭제
    console.log("\n\n[12] 🗑️  문제세트 삭제");
    console.log("=".repeat(80));

    if (userProblemSetId) {
        await testAPI(
            12,
            "문제세트 삭제",
            "DELETE",
            `/api/user-problem-sets/${userProblemSetId}`
        ).then(printResult);

        // 문제세트 삭제 후 ID 초기화
        userProblemSetId = null;
        userProblemIds = [];
        commentIds = [];
    } else {
        console.log("   ⚠️  삭제할 문제세트가 없습니다.");
    }

    // 13. 모든 회원들의 점수 조회
    console.log("\n\n[13] 🏆 모든 회원들의 점수 조회");
    console.log("=".repeat(80));
    await testAPI(13, "전체 점수 조회", "GET", "/api/scores").then(printResult);

    // 14. 로그인한 회원 한명의 점수를 조회
    console.log("\n\n[14] 🏆 특정 회원 점수 조회");
    console.log("=".repeat(80));

    if (loggedInMemberId) {
        await testAPI(
            14,
            "특정 회원 점수 조회",
            "GET",
            `/api/scores/${loggedInMemberId}`
        ).then(printResult);
    }

    // 15. 로그인한 회원 한명의 점수를 수정
    console.log("\n\n[15] ✏️  점수 수정");
    console.log("=".repeat(80));

    await testAPI(15, "점수 수정", "PUT", "/api/scores", {
        score: 200,
    }).then(printResult);

    // 16. 문제테이블(problem테이블) 에서 문제 전체 조회
    console.log("\n\n[16] 📚 문제 전체 조회");
    console.log("=".repeat(80));
    await testAPI(16, "문제 조회", "GET", "/api/problem?limit=10").then(
        printResult
    );

    // 17. 문제테이블(problem테이블) 에서 문제 전체 조회 (다시 조회)
    console.log("\n\n[17] 📚 문제 전체 조회 (재조회)");
    console.log("=".repeat(80));
    await testAPI(
        17,
        "문제 조회 (재조회)",
        "GET",
        "/api/problem?limit=10"
    ).then(printResult);

    // 18. 로그인한 회원의 오답노트에 문제 추가 후 조회
    console.log("\n\n[18] 📖 오답노트 추가 및 조회");
    console.log("=".repeat(80));

    // 기본 문제 추가
    const addNoteResult1 = await testAPI(
        18,
        "오답노트 추가 (기본 문제)",
        "POST",
        "/api/incorrect-note",
        {
            problemId: 1,
            userProblemId: null,
            isUserProblem: false,
        }
    );
    printResult(addNoteResult1);
    if (addNoteResult1.success && addNoteResult1.response?.data) {
        incorrectNoteId = addNoteResult1.response.data;
    }

    // 유저제작문제 추가
    if (userProblemIds.length > 0) {
        const addNoteResult2 = await testAPI(
            18,
            "오답노트 추가 (유저제작문제)",
            "POST",
            "/api/incorrect-note",
            {
                problemId: null,
                userProblemId: userProblemIds[0],
                isUserProblem: true,
            }
        );
        printResult(addNoteResult2);
    }

    // 오답노트 조회
    await testAPI(18, "오답노트 조회", "GET", "/api/incorrect-note").then(
        printResult
    );

    // 19. 로그인한 회원의 오답노트에 있는 문제 삭제
    console.log("\n\n[19] 🗑️  오답노트 삭제");
    console.log("=".repeat(80));

    if (incorrectNoteId) {
        await testAPI(
            19,
            "오답노트 삭제",
            "DELETE",
            `/api/incorrect-note/${incorrectNoteId}`
        ).then(printResult);
    }

    // 20. 모든 퀴즈방 목록 조회
    console.log("\n\n[20] 🏠 퀴즈방 목록 조회");
    console.log("=".repeat(80));
    await testAPI(20, "퀴즈방 목록 조회", "GET", "/api/quiz-room").then(
        printResult
    );

    // 21. 로그인한 회원이 퀴즈방을 생성하고 방장이 됨(isHost = 1)
    console.log("\n\n[21] 🏠 퀴즈방 생성 (방장)");
    console.log("=".repeat(80));

    if (loggedInMemberId) {
        const createRoomResult = await testAPI(
            21,
            "퀴즈방 생성",
            "POST",
            `/api/quiz-room/create/${loggedInMemberId}`,
            undefined
        );
        printResult(createRoomResult);

        if (createRoomResult.success && createRoomResult.response?.data) {
            quizRoomId = createRoomResult.response.data;
            console.log(`   📝 생성된 퀴즈방 ID: ${quizRoomId}`);
        }
    }

    // 22. 또 다른 mcp서버가 localhost:8082에서 가동되며 같은 DB 다른 회원을 가입하고 로그인
    // 전체 퀴즈방들을 조회하여 조회된 퀴즈방에 들어가있는 회원들을 조회하고
    // isHost=0인 방장이 아닌 상태로 다른 방장이 만든 퀴즈방에 들어가기
    // 이 시나리오는 별도의 서버가 필요하므로 스킵
    console.log("\n\n[22] ⚠️  다른 서버 테스트 (스킵)");
    console.log("=".repeat(80));
    console.log(
        "   ⚠️  이 시나리오는 localhost:8082에서 별도의 서버가 필요하므로 스킵합니다."
    );
    console.log(
        "   시나리오: 다른 서버에서 회원 가입/로그인 → 퀴즈방 목록 조회 → 퀴즈방 멤버 조회 → 퀴즈방 입장"
    );

    // 23. 방장인 회원이 퀴즈방을 삭제
    console.log("\n\n[23] 🗑️  퀴즈방 삭제");
    console.log("=".repeat(80));

    if (quizRoomId) {
        await testAPI(
            23,
            "퀴즈방 삭제",
            "DELETE",
            `/api/quiz-room/${quizRoomId}`
        ).then(printResult);
    } else {
        console.log("   ⚠️  삭제할 퀴즈방이 없습니다.");
    }

    // 테스트 결과 요약
    console.log("\n\n" + "=".repeat(80));
    console.log("📊 테스트 시나리오 결과 요약");
    console.log("=".repeat(80));

    const total = results.length;
    const success = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`\n총 테스트: ${total}개`);
    console.log(`✅ 성공: ${success}개`);
    console.log(`❌ 실패: ${failed}개`);
    console.log(`성공률: ${((success / total) * 100).toFixed(1)}%`);

    console.log("\n\n✅ 성공한 테스트:");
    results
        .filter((r) => r.success)
        .forEach((r) => {
            console.log(
                `✅ [${r.step}] ${r.name} - ${r.method} ${r.url} (${r.status})`
            );
        });

    console.log("\n\n❌ 실패한 테스트:");
    const failedResults = results.filter((r) => !r.success);
    if (failedResults.length === 0) {
        console.log("없음 - 모든 테스트가 성공했습니다! 🎉");
    } else {
        failedResults.forEach((r) => {
            console.log(`\n❌ [${r.step}] ${r.name}`);
            console.log(`   ${r.method} ${r.url}`);
            console.log(`   상태: ${r.status || "N/A"}`);
            console.log(`   에러: ${r.message.substring(0, 150)}`);
        });
    }

    // 결과를 파일로 저장
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timestamp = `${year}${month}${day}${hours}${minutes}`;
    const filename = `testResult${timestamp}.md`;

    let report = "# 테스트 시나리오 결과 보고서\n\n";
    report += `**테스트 일시**: ${year}-${month}-${day} ${hours}:${minutes}\n\n`;
    report += `**총 테스트**: ${total}개\n`;
    report += `**✅ 성공**: ${success}개\n`;
    report += `**❌ 실패**: ${failed}개\n`;
    report += `**성공률**: ${((success / total) * 100).toFixed(1)}%\n\n`;
    report += "---\n\n";

    report += "## ✅ 성공한 테스트\n\n";
    results
        .filter((r) => r.success)
        .forEach((r) => {
            report += `### [${r.step}] ${r.name}\n`;
            report += `- **Method**: ${r.method}\n`;
            report += `- **URL**: ${r.url}\n`;
            report += `- **Status**: ${r.status}\n`;
            report += `- **메시지**: ${r.message}\n\n`;
        });

    report += "---\n\n";
    report += "## ❌ 실패한 테스트\n\n";
    if (failedResults.length === 0) {
        report += "없음 - 모든 테스트가 성공했습니다! 🎉\n\n";
    } else {
        failedResults.forEach((r) => {
            report += `### [${r.step}] ${r.name}\n`;
            report += `- **Method**: ${r.method}\n`;
            report += `- **URL**: ${r.url}\n`;
            report += `- **Status**: ${r.status || "N/A"}\n`;
            report += `- **에러**: ${r.message}\n\n`;
        });
    }

    report += "---\n\n";
    report += "## 📋 상세 결과\n\n";
    results.forEach((r) => {
        const icon = r.success ? "✅" : "❌";
        report += `### [${r.step}] ${icon} ${r.name}\n\n`;
        report += `- **Method**: \`${r.method}\`\n`;
        report += `- **URL**: \`${r.url}\`\n`;
        report += `- **Status**: ${r.status || "N/A"}\n`;
        report += `- **메시지**: ${r.message}\n`;
        if (r.response && r.success) {
            report += `- **응답**: \`\`\`json\n${JSON.stringify(
                r.response,
                null,
                2
            )}\n\`\`\`\n`;
        }
        if (r.error && !r.success) {
            report += `- **에러**: \`\`\`json\n${JSON.stringify(
                r.error,
                null,
                2
            )}\n\`\`\`\n`;
        }
        report += "\n";
    });

    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, report, "utf-8");
    console.log(`\n📄 테스트 결과가 저장되었습니다: ${filename}`);
}

// 테스트 실행
runTestScenario().catch((error) => {
    console.error("\n❌ 테스트 실행 중 오류 발생:", error);
    process.exit(1);
});
