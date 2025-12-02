# Vite 프록시 설정 가이드

## 설치 및 실행

1. **의존성 설치**
   ```bash
   cd mcp-backend-test
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **브라우저에서 접속**
   - http://localhost:5500/testScenario.html

## 프록시 동작 방식

- 프론트엔드: `/api/*` 요청 → Vite 개발 서버 (포트 5500)
- Vite 프록시: `/api/*` 요청 → Spring Boot 서버 (포트 8080)
- 쿠키/세션: 같은 도메인으로 처리되어 CORS 문제 해결

## 장점

1. **CORS 문제 해결**: 같은 도메인(포트 5500)에서 요청하므로 CORS 설정 불필요
2. **쿠키 자동 전송**: 브라우저가 자동으로 쿠키를 포함하여 전송
3. **세션 유지**: JSESSIONID 쿠키가 정상적으로 저장되고 전송됨

## 설정 파일

- `vite.config.js`: 프록시 설정
- `package.json`: Vite 의존성 및 스크립트
- `testScenario.html`: API 테스트 페이지

