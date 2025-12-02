// testAllAPIsComplete.ts
// id: "2", password: "1234"로 로그인 후 모든 API 테스트

import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import * as fs from "fs";
import * as path from "path";

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
    console.log(`\n${icon} ${result.name}`);
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

async function testAllAPIs() {
    console.log("🚀 id: '2', password: '1234'로 로그인 후 모든 API 테스트\n");
    console.log("=".repeat(80));

    const testId = "2";
    const testPassword = "1234";

    let loggedInMemberId: number | null = null;
    let userProblemSetId: number | null = null;
    let userProblemIds: number[] = [];
    let commentIds: number[] = [];
    let quizRoomId: number | null = null;
    let incorrectNoteId: number | null = null;

    // ==========================================
    // 1. MemberController 테스트
    // ==========================================
    console.log("\n\n👤 [1. MemberController 테스트]");
    console.log("=".repeat(80));

    // 1-1. 로그인
    console.log("\n[1-1] 로그인");
    const loginResult = await testAPI("로그인", "POST", "/api/auth/login", {
        id: testId,
        password: testPassword,
    });
    printResult(loginResult);

    if (loginResult.success && loginResult.response?.data?.memberId) {
        loggedInMemberId = loginResult.response.data.memberId;
        console.log(`   📝 로그인 성공! 회원 ID: ${loggedInMemberId}`);
    } else {
        console.log("\n   ❌ 로그인 실패! 테스트를 중단합니다.");
        return;
    }

    // 1-2. 회원 조회
    console.log("\n[1-2] 회원 조회");
    await testAPI("회원 조회", "GET", "/api/members/").then(printResult);

    // 1-3. ID 중복체크
    console.log("\n[1-3] ID 중복체크");
    await testAPI("ID 중복체크", "POST", "/api/check-id", {
        value: testId,
    }).then(printResult);

    // 1-4. 이메일 중복체크
    console.log("\n[1-4] 이메일 중복체크");
    await testAPI("이메일 중복체크", "POST", "/api/check-email", {
        value: "test2@test.com",
    }).then(printResult);

    // 1-5. 닉네임 중복체크
    console.log("\n[1-5] 닉네임 중복체크");
    await testAPI("닉네임 중복체크", "POST", "/api/check-nickname", {
        value: "테스트유저2",
    }).then(printResult);

    // 1-6. 회원 정보 수정 (PATCH /api/members/{memberId})
    if (loggedInMemberId) {
        console.log("\n[1-6] 회원 정보 수정");
        await testAPI(
            "회원 정보 수정",
            "PATCH",
            `/api/members/${loggedInMemberId}`,
            {
                nickname: "수정된닉네임",
                email: "updated@test.com",
            }
        ).then(printResult);
    }

    // 1-7. 회원 정보 업데이트 (PATCH /api)
    if (loggedInMemberId) {
        console.log("\n[1-7] 회원 정보 업데이트");
        await testAPI("회원 정보 업데이트", "PATCH", "/api", {
            nickname: "업데이트된닉네임",
        }).then(printResult);
    }

    // ==========================================
    // 2. ProblemController 테스트
    // ==========================================
    console.log("\n\n📚 [2. ProblemController 테스트]");
    console.log("=".repeat(80));

    // 2-1. 문제 조회 (INFOENGINEERING)
    console.log("\n[2-1] 문제 조회 (INFOENGINEERING)");
    await testAPI(
        "문제 조회",
        "GET",
        "/api/problem?limit=3&category=INFOENGINEERING"
    ).then(printResult);

    // 2-2. 문제 조회 (SQLD)
    console.log("\n[2-2] 문제 조회 (SQLD)");
    await testAPI(
        "문제 조회 (SQLD)",
        "GET",
        "/api/problem?limit=2&category=SQLD"
    ).then(printResult);

    // ==========================================
    // 3. QuizRoomController 테스트
    // ==========================================
    console.log("\n\n🏠 [3. QuizRoomController 테스트]");
    console.log("=".repeat(80));

    // 3-1. 퀴즈방 목록 조회
    console.log("\n[3-1] 퀴즈방 목록 조회");
    const roomListResult = await testAPI(
        "퀴즈방 목록 조회",
        "GET",
        "/api/quiz-room"
    );
    printResult(roomListResult);

    // 3-2. 퀴즈방 생성
    if (loggedInMemberId) {
        console.log("\n[3-2] 퀴즈방 생성");
        const createRoomResult = await testAPI(
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

    // 3-3. 퀴즈방 멤버 조회
    if (quizRoomId) {
        console.log("\n[3-3] 퀴즈방 멤버 조회");
        await testAPI(
            "퀴즈방 멤버 조회",
            "GET",
            `/api/quiz-room/${quizRoomId}/member`
        ).then(printResult);
    }

    // 3-4. 퀴즈방 삭제 (테스트용으로 생성한 방 삭제)
    if (quizRoomId) {
        console.log("\n[3-4] 퀴즈방 삭제");
        await testAPI(
            "퀴즈방 삭제",
            "DELETE",
            `/api/quiz-room/${quizRoomId}`
        ).then(printResult);
    }

    // ==========================================
    // 4. UserProblemSetController 테스트
    // ==========================================
    console.log("\n\n📦 [4. UserProblemSetController 테스트]");
    console.log("=".repeat(80));

    // 4-1. 모든 문제세트 조회
    console.log("\n[4-1] 모든 문제세트 조회");
    await testAPI("모든 문제세트 조회", "GET", "/api/user-problem-sets").then(
        printResult
    );

    // 4-2. 내 문제세트 조회
    console.log("\n[4-2] 내 문제세트 조회");
    const mySetResult = await testAPI(
        "내 문제세트 조회",
        "GET",
        "/api/user-problem-sets/me"
    );
    printResult(mySetResult);
    if (mySetResult.success && mySetResult.response?.data?.userProblemSetId) {
        userProblemSetId = mySetResult.response.data.userProblemSetId;
        console.log(`   📝 문제세트 ID: ${userProblemSetId}`);
    } else {
        // 4-3. 문제세트 생성
        console.log("\n[4-3] 문제세트 생성");
        const createSetResult = await testAPI(
            "문제세트 생성",
            "POST",
            "/api/user-problem-sets",
            undefined
        );
        printResult(createSetResult);
        if (createSetResult.success) {
            const recheckResult = await testAPI(
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
    }

    // ==========================================
    // 5. UserProblemController 테스트
    // ==========================================
    console.log("\n\n📝 [5. UserProblemController 테스트]");
    console.log("=".repeat(80));

    // 5-1. 문제세트의 문제들 조회
    console.log("\n[5-1] 문제세트의 문제들 조회");
    const targetSetId = userProblemSetId || 1;
    const getProblemsResult = await testAPI(
        "문제세트의 문제들 조회",
        "GET",
        `/api/user-problems/sets/${targetSetId}`
    );
    printResult(getProblemsResult);

    if (getProblemsResult.success && getProblemsResult.response?.data) {
        userProblemIds = getProblemsResult.response.data
            .map((p: any) => p.userProblemId)
            .filter((id: number) => id !== undefined);
    }

    // 5-2. 문제 일괄 등록
    console.log("\n[5-2] 문제 일괄 등록");
    const addProblemsResult = await testAPI(
        "문제 일괄 등록",
        "POST",
        `/api/user-problems/sets/${targetSetId}`,
        [
            {
                problemDescription: "전체 API 테스트 문제 1",
                category: "INFOENGINEERING",
                choice1: "선택지1",
                choice2: "선택지2",
                choice3: "선택지3",
                choice4: "선택지4",
                answer: "1",
            },
            {
                problemDescription: "전체 API 테스트 문제 2",
                category: "INFOENGINEERING",
                choice1: "선택지A",
                choice2: "선택지B",
                choice3: "선택지C",
                choice4: "선택지D",
                answer: "2",
            },
        ]
    );
    printResult(addProblemsResult);

    // 5-3. 문제 수정
    if (userProblemIds.length > 0) {
        console.log(`\n[5-3] 문제 수정 (userProblemId: ${userProblemIds[0]})`);
        await testAPI(
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

    // 5-4. 문제 삭제
    if (userProblemIds.length > 1) {
        console.log(`\n[5-4] 문제 삭제 (userProblemId: ${userProblemIds[1]})`);
        await testAPI(
            "문제 삭제",
            "DELETE",
            `/api/user-problems/${userProblemIds[1]}`
        ).then(printResult);
    }

    // ==========================================
    // 6. CommentController 테스트
    // ==========================================
    console.log("\n\n💬 [6. CommentController 테스트]");
    console.log("=".repeat(80));

    // 6-1. 댓글 조회
    console.log("\n[6-1] 댓글 조회");
    const getCommentsResult = await testAPI(
        "댓글 조회",
        "GET",
        `/api/comments/${targetSetId}`
    );
    printResult(getCommentsResult);

    if (getCommentsResult.success && getCommentsResult.response?.data) {
        commentIds = getCommentsResult.response.data
            .map((c: any) => c.commentId)
            .filter((id: number) => id !== undefined);
    }

    // 6-2. 댓글 추가
    console.log("\n[6-2] 댓글 추가");
    const addCommentResult = await testAPI(
        "댓글 추가",
        "POST",
        `/api/comments/${targetSetId}`,
        {
            content: "전체 API 테스트 댓글입니다!",
        }
    );
    printResult(addCommentResult);

    // 6-3. 댓글 수정
    if (commentIds.length > 0 && loggedInMemberId) {
        console.log(`\n[6-3] 댓글 수정 (commentId: ${commentIds[0]})`);
        await testAPI(
            "댓글 수정",
            "PATCH",
            `/api/comments/${targetSetId}/${commentIds[0]}`,
            {
                content: "수정된 댓글 내용입니다!",
                memberId: loggedInMemberId,
            }
        ).then(printResult);
    }

    // 6-4. 댓글 삭제
    if (commentIds.length > 1) {
        console.log(`\n[6-4] 댓글 삭제 (commentId: ${commentIds[1]})`);
        await testAPI(
            "댓글 삭제",
            "DELETE",
            `/api/comments/${targetSetId}/${commentIds[1]}`
        ).then(printResult);
    }

    // ==========================================
    // 7. IncorrectNoteController 테스트
    // ==========================================
    console.log("\n\n📖 [7. IncorrectNoteController 테스트]");
    console.log("=".repeat(80));

    // 7-1. 오답노트 조회
    console.log("\n[7-1] 오답노트 조회");
    await testAPI("오답노트 조회", "GET", "/api/incorrect-note").then(
        printResult
    );

    // 7-2. 오답노트 추가 (기본 문제)
    console.log("\n[7-2] 오답노트 추가 (기본 문제)");
    const addNoteResult1 = await testAPI(
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

    // 7-3. 오답노트 추가 (유저제작문제)
    if (userProblemIds.length > 0) {
        console.log(
            `\n[7-3] 오답노트 추가 (유저제작문제, userProblemId: ${userProblemIds[0]})`
        );
        const addNoteResult2 = await testAPI(
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

    // 7-4. 오답노트 조회 (추가 후)
    console.log("\n[7-4] 오답노트 조회 (추가 후)");
    await testAPI("오답노트 조회", "GET", "/api/incorrect-note").then(
        printResult
    );

    // 7-5. 오답노트 삭제
    if (incorrectNoteId) {
        console.log(
            `\n[7-5] 오답노트 삭제 (incorrectNoteId: ${incorrectNoteId})`
        );
        await testAPI(
            "오답노트 삭제",
            "DELETE",
            `/api/incorrect-note/${incorrectNoteId}`
        ).then(printResult);
    }

    // ==========================================
    // 8. UserScoreController 테스트
    // ==========================================
    console.log("\n\n🏆 [8. UserScoreController 테스트]");
    console.log("=".repeat(80));

    // 8-1. 점수 등록
    if (loggedInMemberId) {
        console.log("\n[8-1] 점수 등록");
        const createScoreResult = await testAPI(
            "점수 등록",
            "POST",
            "/api/scores",
            {
                score: 100,
            }
        );
        printResult(createScoreResult);
    }

    // 8-2. 전체 유저 점수 조회
    console.log("\n[8-2] 전체 유저 점수 조회");
    await testAPI("전체 유저 점수 조회", "GET", "/api/scores").then(
        printResult
    );

    // 8-3. 특정 유저 점수 조회
    if (loggedInMemberId) {
        console.log(
            `\n[8-3] 특정 유저 점수 조회 (memberId: ${loggedInMemberId})`
        );
        await testAPI(
            "특정 유저 점수 조회",
            "GET",
            `/api/scores/${loggedInMemberId}`
        ).then(printResult);
    }

    // 8-4. 점수 수정
    if (loggedInMemberId) {
        console.log("\n[8-4] 점수 수정");
        await testAPI("점수 수정", "PUT", "/api/scores", {
            score: 200,
        }).then(printResult);
    }

    // ==========================================
    // 9. 로그아웃
    // ==========================================
    console.log("\n\n🔐 [9. 로그아웃]");
    console.log("=".repeat(80));

    await testAPI("로그아웃", "POST", "/api/auth/logout").then(printResult);

    // ==========================================
    // 테스트 결과 요약
    // ==========================================
    console.log("\n\n" + "=".repeat(80));
    console.log("📊 전체 API 테스트 결과 요약");
    console.log("=".repeat(80));

    const total = results.length;
    const success = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`\n총 테스트: ${total}개`);
    console.log(`✅ 성공: ${success}개`);
    console.log(`❌ 실패: ${failed}개`);
    console.log(`성공률: ${((success / total) * 100).toFixed(1)}%`);

    console.log("\n\n✅ 성공한 API:");
    results
        .filter((r) => r.success)
        .forEach((r) => {
            console.log(`✅ ${r.name} - ${r.method} ${r.url} (${r.status})`);
        });

    console.log("\n\n❌ 실패한 API:");
    const failedResults = results.filter((r) => !r.success);
    if (failedResults.length === 0) {
        console.log("없음 - 모든 API가 성공했습니다! 🎉");
    } else {
        failedResults.forEach((r) => {
            console.log(`\n❌ ${r.name}`);
            console.log(`   ${r.method} ${r.url}`);
            console.log(`   상태: ${r.status || "N/A"}`);
            console.log(`   에러: ${r.message.substring(0, 150)}`);
        });
    }

    // 컨트롤러별 통계
    console.log("\n\n📊 컨트롤러별 통계:");
    const controllerStats: {
        [key: string]: { total: number; success: number };
    } = {};
    results.forEach((r) => {
        const controller = r.name.split(" ")[0];
        if (!controllerStats[controller]) {
            controllerStats[controller] = { total: 0, success: 0 };
        }
        controllerStats[controller].total++;
        if (r.success) {
            controllerStats[controller].success++;
        }
    });

    Object.entries(controllerStats).forEach(([controller, stats]) => {
        const rate = ((stats.success / stats.total) * 100).toFixed(1);
        console.log(
            `   ${controller}: ${stats.success}/${stats.total} (${rate}%)`
        );
    });

    console.log("\n" + "=".repeat(80));
    console.log("🎉 전체 API 테스트 완료!\n");

    // 테스트 결과를 파일로 저장
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}`;
    const filename = `test-results_${timestamp}.txt`;

    let report = "=".repeat(80) + "\n";
    report += "📊 전체 API 테스트 결과 보고서\n";
    report += `테스트 일시: ${year}-${month}-${day} ${hours}:${minutes}\n`;
    report += `테스트 계정: id: "${testId}", password: "${testPassword}"\n`;
    report += "=".repeat(80) + "\n\n";

    report += `총 테스트: ${total}개\n`;
    report += `✅ 성공: ${success}개\n`;
    report += `❌ 실패: ${failed}개\n`;
    report += `성공률: ${((success / total) * 100).toFixed(1)}%\n\n`;

    report += "=".repeat(80) + "\n";
    report += "✅ 성공한 API:\n";
    report += "=".repeat(80) + "\n";
    results
        .filter((r) => r.success)
        .forEach((r) => {
            report += `✅ ${r.name}\n`;
            report += `   ${r.method} ${r.url}\n`;
            report += `   상태: ${r.status}\n`;
            report += `   메시지: ${r.message}\n\n`;
        });

    report += "\n" + "=".repeat(80) + "\n";
    report += "❌ 실패한 API:\n";
    report += "=".repeat(80) + "\n";
    if (failedResults.length === 0) {
        report += "없음 - 모든 API가 성공했습니다! 🎉\n";
    } else {
        failedResults.forEach((r) => {
            report += `❌ ${r.name}\n`;
            report += `   ${r.method} ${r.url}\n`;
            report += `   상태: ${r.status || "N/A"}\n`;
            report += `   에러: ${r.message}\n\n`;
        });
    }

    report += "\n" + "=".repeat(80) + "\n";
    report += "📊 컨트롤러별 통계:\n";
    report += "=".repeat(80) + "\n";
    Object.entries(controllerStats).forEach(([controller, stats]) => {
        const rate = ((stats.success / stats.total) * 100).toFixed(1);
        report += `   ${controller}: ${stats.success}/${stats.total} (${rate}%)\n`;
    });

    report += "\n" + "=".repeat(80) + "\n";
    report += "🎉 전체 API 테스트 완료!\n";
    report += "=".repeat(80) + "\n";

    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, report, "utf-8");
    console.log(`\n📄 테스트 결과가 저장되었습니다: ${filename}`);
}

// 테스트 실행
testAllAPIs().catch((error) => {
    console.error("\n❌ 테스트 실행 중 오류 발생:", error);
    process.exit(1);
});
