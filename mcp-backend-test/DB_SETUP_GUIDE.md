# MySQL 권한 설정 가이드

## 🚀 빠른 설정 방법

### 방법 1: SQL 파일 실행 (권장)

```bash
# root 계정으로 SQL 파일 실행
mysql -u root -p < mcp-backend-test/setup_permissions.sql

# 또는 MySQL 내부에서 실행
mysql -u root -p
source mcp-backend-test/setup_permissions.sql;
```

### 방법 2: 직접 명령어 실행

```bash
# MySQL 접속
mysql -u root -p

# MySQL 프롬프트에서 아래 명령어 실행
```

```sql
-- 사용자 생성 (이미 있으면 건너뛰기)
CREATE USER IF NOT EXISTS 'bang_user'@'localhost' IDENTIFIED BY 'bang_password';

-- 권한 부여
GRANT ALL PRIVILEGES ON board_test.* TO 'bang_user'@'localhost';

-- 권한 적용
FLUSH PRIVILEGES;

-- 권한 확인
SHOW GRANTS FOR 'bang_user'@'localhost';

-- 종료
exit;
```

### 방법 3: 개발 환경용 (모든 권한)

```sql
-- 주의: 개발 환경에서만 사용!
GRANT ALL PRIVILEGES ON *.* TO 'bang_user'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

## 🔍 문제 해결

### 1. root 비밀번호를 모르는 경우

**Windows:**
```bash
# 1. MySQL 서비스 중지
net stop MySQL80

# 2. 안전 모드로 시작
mysqld --console --skip-grant-tables

# 3. 새 터미널에서 접속 (비밀번호 없이)
mysql -u root

# 4. 비밀번호 변경
ALTER USER 'root'@'localhost' IDENTIFIED BY '새비밀번호';
FLUSH PRIVILEGES;
exit;

# 5. MySQL 재시작
net start MySQL80
```

**Linux/Mac:**
```bash
sudo systemctl stop mysql
sudo mysqld_safe --skip-grant-tables &
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY '새비밀번호';
FLUSH PRIVILEGES;
exit;
sudo systemctl restart mysql
```

### 2. 권한이 제대로 안 될 때

```sql
-- 기존 사용자 삭제 후 재생성
DROP USER IF EXISTS 'bang_user'@'localhost';
CREATE USER 'bang_user'@'localhost' IDENTIFIED BY 'bang_password';
GRANT ALL PRIVILEGES ON board_test.* TO 'bang_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 호스트 문제 해결

```sql
-- localhost 대신 % (모든 호스트) 허용
CREATE USER 'bang_user'@'%' IDENTIFIED BY 'bang_password';
GRANT ALL PRIVILEGES ON board_test.* TO 'bang_user'@'%';
FLUSH PRIVILEGES;
```

### 4. 데이터베이스가 없는 경우

```sql
-- board_test 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS board_test;

-- 필요한 테이블 생성
USE board_test;

CREATE TABLE IF NOT EXISTS member (
    member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    login_id VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_problem_set (
    user_problem_set_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES member(member_id)
);

CREATE TABLE IF NOT EXISTS user_problem (
    user_problem_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    problem_description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    choice_1 VARCHAR(255) NOT NULL,
    choice_2 VARCHAR(255) NOT NULL,
    choice_3 VARCHAR(255) NOT NULL,
    choice_4 VARCHAR(255) NOT NULL,
    answer VARCHAR(10) NOT NULL,
    comment_count INT DEFAULT 0,
    user_problem_set_id BIGINT NOT NULL,
    FOREIGN KEY (user_problem_set_id) REFERENCES user_problem_set(user_problem_set_id)
);

CREATE TABLE IF NOT EXISTS comment (
    comment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_problem_set_id BIGINT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES member(member_id),
    FOREIGN KEY (user_problem_set_id) REFERENCES user_problem_set(user_problem_set_id)
);

-- 테스트용 회원 데이터 삽입
INSERT INTO member (login_id, password, name) VALUES 
('testuser', 'password123', '테스트유저')
ON DUPLICATE KEY UPDATE login_id=login_id;
```

## ✅ 권한 설정 확인

```sql
-- 현재 사용자 확인
SELECT USER();

-- bang_user 권한 확인
SHOW GRANTS FOR 'bang_user'@'localhost';

-- 연결 테스트
mysql -u bang_user -pbang_password -e "SELECT DATABASE(); SHOW TABLES FROM board_test;"
```

## 📋 권한 종류

| 권한 | 설명 |
|------|------|
| `ALL PRIVILEGES` | 모든 권한 |
| `SELECT` | 데이터 조회 |
| `INSERT` | 데이터 삽입 |
| `UPDATE` | 데이터 수정 |
| `DELETE` | 데이터 삭제 |
| `CREATE` | 테이블 생성 |
| `DROP` | 테이블 삭제 |
| `ALTER` | 테이블 구조 변경 |
| `INDEX` | 인덱스 관리 |

## 🔒 보안 권장사항

1. **개발 환경**: `GRANT ALL PRIVILEGES ON board_test.*`
2. **운영 환경**: 필요한 권한만 부여
   ```sql
   GRANT SELECT, INSERT, UPDATE, DELETE ON board_test.* TO 'bang_user'@'localhost';
   ```

---

## 💡 다음 단계

권한 설정 후:
```bash
cd mcp-backend-test
npx tsx testConnection.ts  # 연결 테스트
npx tsx insertDummyData.ts # 더미 데이터 삽입
```


