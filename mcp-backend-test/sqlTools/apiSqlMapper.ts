// apiSqlMapper.ts
import type { Pool } from "mysql2/promise";

/**
 * API와 SQL 쿼리를 매핑하는 시스템
 * Controller -> Service -> Dao -> Mapper.xml 흐름을 추적하여 매핑
 */

export interface SqlExecutionResult {
  apiName: string;
  sqlQueries: Array<{
    query: string;
    sql: string;
    params: any;
    result: any;
  }>;
}

/**
 * API 호출 후 해당하는 SQL 쿼리를 자동으로 실행하는 함수
 */
export class ApiSqlMapper {
  constructor(private pool: Pool) {}

  /**
   * Comment API에 매핑된 SQL 실행
   */
  async executeCommentSql(
    apiName: string,
    params: any
  ): Promise<SqlExecutionResult> {
    const sqlQueries: any[] = [];

    switch (apiName) {
      case "comment_get_all_by_set":
        // GET /api/comments/{userProblemSetId}
        // -> CommentService.getAllCommentsById()
        // -> CommentDao.selectCommentsByuserProblemSetId()
        const selectSql = `
          SELECT *
          FROM comment
          WHERE user_problem_set_id = ?
        `;
        const [selectRows] = (await this.pool.query(selectSql, [
          params.userProblemSetId,
        ])) as any;
        sqlQueries.push({
          query: "selectCommentsByuserProblemSetId",
          sql: selectSql.trim(),
          params: { userProblemSetId: params.userProblemSetId },
          result: selectRows,
        });
        break;

      case "comment_add":
        // POST /api/comments/{userProblemSetId}
        // -> CommentService.addComment()
        // -> CommentDao.insertComment()
        const insertSql = `
          INSERT INTO comment (member_id, content, comment_date, user_problem_set_id)
          VALUES (?, ?, ?, ?)
        `;
        const commentDate = new Date();
        const [insertResult] = (await this.pool.query(insertSql, [
          params.comment.memberId,
          params.comment.content,
          commentDate,
          params.userProblemSetId,
        ])) as any;
        sqlQueries.push({
          query: "insertComment",
          sql: insertSql.trim(),
          params: {
            memberId: params.comment.memberId,
            content: params.comment.content,
            commentDate,
            userProblemSetId: params.userProblemSetId,
          },
          result: insertResult,
        });
        break;

      case "comment_update":
        // PATCH /api/comments/{userProblemSetId}/{commentId}
        // -> CommentService.updateComment()
        // -> CommentDao.updateComment()
        const updateSql = `
          UPDATE comment
          SET content = ?
          WHERE comment_id = ?
        `;
        const [updateResult] = (await this.pool.query(updateSql, [
          params.updateRequest.content,
          params.commentId,
        ])) as any;
        sqlQueries.push({
          query: "updateComment",
          sql: updateSql.trim(),
          params: {
            content: params.updateRequest.content,
            commentId: params.commentId,
          },
          result: updateResult,
        });
        break;

      case "comment_delete":
        // DELETE /api/comments/{userProblemSetId}/{commentId}
        // -> CommentService.deleteComment()
        // -> CommentDao.deleteComment()
        // 먼저 소유자 확인
        const ownerSql = `
          SELECT member_id
          FROM comment
          WHERE comment_id = ?
        `;
        const [ownerRows] = (await this.pool.query(ownerSql, [
          params.commentId,
        ])) as any;
        sqlQueries.push({
          query: "selectCommentOwnerId",
          sql: ownerSql.trim(),
          params: { commentId: params.commentId },
          result: ownerRows,
        });

        // 그 다음 삭제
        const deleteSql = `
          DELETE FROM comment
          WHERE comment_id = ?
        `;
        const [deleteResult] = (await this.pool.query(deleteSql, [
          params.commentId,
        ])) as any;
        sqlQueries.push({
          query: "deleteComment",
          sql: deleteSql.trim(),
          params: { commentId: params.commentId },
          result: deleteResult,
        });
        break;
    }

    return {
      apiName,
      sqlQueries,
    };
  }

  /**
   * UserProblem API에 매핑된 SQL 실행
   */
  async executeUserProblemSql(
    apiName: string,
    params: any
  ): Promise<SqlExecutionResult> {
    const sqlQueries: any[] = [];

    switch (apiName) {
      case "user_problem_get_by_set":
        // GET /api/user-problems/sets/{userProblemSetId}
        // -> UserProblemService.getProblemsByUserProblemSetId()
        // -> UserProblemDao.selectProblemsByUserProblemSetId()
        const selectSql = `
          SELECT *
          FROM user_problem
          WHERE user_problem_set_id = ?
        `;
        const [selectRows] = (await this.pool.query(selectSql, [
          params.userProblemSetId,
        ])) as any;
        sqlQueries.push({
          query: "selectProblemsByUserProblemSetId",
          sql: selectSql.trim(),
          params: { userProblemSetId: params.userProblemSetId },
          result: selectRows,
        });
        break;

      case "user_problem_create_bulk":
        // POST /api/user-problems/sets/{userProblemSetId}
        // -> UserProblemService.addUserProblems()
        // -> UserProblemDao.insertUserProblemList()
        const values = params.userProblems.map((p: any) => [
          p.problemDescription,
          p.category,
          p.choice1,
          p.choice2,
          p.choice3,
          p.choice4,
          p.answer,
          p.commentCount || 0,
          params.userProblemSetId,
        ]);

        const insertSql = `
          INSERT INTO user_problem
          (problem_description, category, choice_1, choice_2, choice_3, choice_4, answer, comment_count, user_problem_set_id)
          VALUES ?
        `;
        const [insertResult] = (await this.pool.query(insertSql, [
          values,
        ])) as any;
        sqlQueries.push({
          query: "insertUserProblemList",
          sql: insertSql.trim(),
          params: { userProblems: params.userProblems },
          result: insertResult,
        });
        break;

      case "user_problem_update":
        // PUT /api/user-problems/{userProblemId}
        // -> UserProblemService.updateUserProblem()
        // -> UserProblemDao.updateUserProblem()
        const updateSql = `
          UPDATE user_problem
          SET problem_description = ?,
              category = ?,
              choice_1 = ?,
              choice_2 = ?,
              choice_3 = ?,
              choice_4 = ?,
              answer = ?,
              comment_count = ?
          WHERE user_problem_id = ?
        `;
        const [updateResult] = (await this.pool.query(updateSql, [
          params.userProblem.problemDescription,
          params.userProblem.category,
          params.userProblem.choice1,
          params.userProblem.choice2,
          params.userProblem.choice3,
          params.userProblem.choice4,
          params.userProblem.answer,
          params.userProblem.commentCount || 0,
          params.userProblemId,
        ])) as any;
        sqlQueries.push({
          query: "updateUserProblem",
          sql: updateSql.trim(),
          params: {
            ...params.userProblem,
            userProblemId: params.userProblemId,
          },
          result: updateResult,
        });
        break;

      case "user_problem_delete":
        // DELETE /api/user-problems/{userProblemId}
        // -> UserProblemService.deleteUserProblem()
        // -> UserProblemDao.deleteUserProblemById()
        const deleteSql = `
          DELETE FROM user_problem
          WHERE user_problem_id = ?
        `;
        const [deleteResult] = (await this.pool.query(deleteSql, [
          params.userProblemId,
        ])) as any;
        sqlQueries.push({
          query: "deleteUserProblemById",
          sql: deleteSql.trim(),
          params: { userProblemId: params.userProblemId },
          result: deleteResult,
        });
        break;
    }

    return {
      apiName,
      sqlQueries,
    };
  }

  /**
   * UserProblemSet API에 매핑된 SQL 실행
   */
  async executeUserProblemSetSql(
    apiName: string,
    params: any
  ): Promise<SqlExecutionResult> {
    const sqlQueries: any[] = [];

    switch (apiName) {
      case "user_problem_set_get_all":
        // GET /api/user-problem-sets
        // -> UserProblemSetService.getAllUserProblemSets()
        // -> UserProblemSetDao.selectUserProblemSets()
        const selectAllSql = `
          SELECT *
          FROM user_problem_set
        `;
        const [selectAllRows] = (await this.pool.query(selectAllSql)) as any;
        sqlQueries.push({
          query: "selectUserProblemSets",
          sql: selectAllSql.trim(),
          params: {},
          result: selectAllRows,
        });
        break;

      case "user_problem_set_get_my":
        // GET /api/user-problem-sets/me
        // -> UserProblemSetService.getUserProblemSetByMemberId()
        // -> UserProblemSetDao.selectUserProblemSetByMemberId()
        // 참고: memberId는 세션에서 가져오므로 params에 필요
        const selectByMemberSql = `
          SELECT *
          FROM user_problem_set
          WHERE member_id = ?
        `;
        const [selectByMemberRows] = (await this.pool.query(
          selectByMemberSql,
          [params.memberId]
        )) as any;
        sqlQueries.push({
          query: "selectUserProblemSetByMemberId",
          sql: selectByMemberSql.trim(),
          params: { memberId: params.memberId },
          result: selectByMemberRows,
        });
        break;

      case "user_problem_set_create":
        // POST /api/user-problem-sets
        // -> UserProblemSetService.createUserProblemSet()
        // -> UserProblemSetDao.insertUserProblemSet()
        const insertSql = `
          INSERT INTO user_problem_set (member_id)
          VALUES (?)
        `;
        const [insertResult] = (await this.pool.query(insertSql, [
          params.memberId,
        ])) as any;
        sqlQueries.push({
          query: "insertUserProblemSet",
          sql: insertSql.trim(),
          params: { memberId: params.memberId },
          result: insertResult,
        });
        break;

      case "user_problem_set_delete":
        // DELETE /api/user-problem-sets/{userProblemSetId}
        // -> UserProblemSetService.deleteUserProblemSet()
        // -> UserProblemSetDao.deleteUserProblemSetById()
        const deleteSql = `
          DELETE FROM user_problem_set
          WHERE user_problem_set_id = ?
        `;
        const [deleteResult] = (await this.pool.query(deleteSql, [
          params.userProblemSetId,
        ])) as any;
        sqlQueries.push({
          query: "deleteUserProblemSetById",
          sql: deleteSql.trim(),
          params: { userProblemSetId: params.userProblemSetId },
          result: deleteResult,
        });
        break;
    }

    return {
      apiName,
      sqlQueries,
    };
  }
}
