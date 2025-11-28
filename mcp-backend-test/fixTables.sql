// fixTables.sql
-- 테이블 구조 수정 SQL

-- 1. user_problem_set 테이블 수정
ALTER TABLE user_problem_set
ADD PRIMARY KEY (user_problem_set_id);

ALTER TABLE user_problem_set
MODIFY COLUMN user_problem_set_id BIGINT NOT NULL AUTO_INCREMENT;

-- 2. user_problem 테이블 확인 및 수정
-- PRIMARY KEY가 있는지 확인 후 없으면 추가
ALTER TABLE user_problem
ADD PRIMARY KEY (user_problem_id);

ALTER TABLE user_problem
MODIFY COLUMN user_problem_id BIGINT NOT NULL AUTO_INCREMENT;

-- 3. comment 테이블 확인 및 수정
ALTER TABLE comment
ADD PRIMARY KEY (comment_id);

ALTER TABLE comment
MODIFY COLUMN comment_id BIGINT NOT NULL AUTO_INCREMENT;

SELECT '✅ 모든 테이블 수정 완료!' as status;


