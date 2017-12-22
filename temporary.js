/*

/comments

POST

*/

function createComment(url, request){
  const requestComment = request.body && request.body.comment;
  const response = {};

  if (requestComment && requestComment.body && requestComment.articleId &&
      requestComment.username && database.users[requestComment.username]) {
    const comment = {
      id: database.nextCommentId++,
      body: requestComment.body,
      username: requestComment.username,
      articleId: requestComment.articleId,
      upvotedBy: [],
      downvotedBy: []
    };

    database.comments[comment.id] = comment;
    // database.users[comment.username].articleIds.push(comment.id); MIGHT NEED TO PUT ARRAY OF USER COMMENT IDS

    response.body = {comment: comment};
    response.status = 201;
  } else {
    response.status = 400;
  }

  return response;
}

/*

/comments/:id

PUT

*/

function updateComment(url, request) {
  const id = Number(url.split('/').filter(segment => segment)[1]);
  const savedComment = database.comments[id];
  const requestComment = request.body && request.body.comment;
  const response = {};

  if (!id || !requestComment) {
    response.status = 400;
  } else if (!savedComment) {
    response.status = 404;
  } else {
    savedComment.body = requestComment.body || savedComment.body;

    response.body = {comment: savedComment};
    response.status = 200;
  }

  return response;
}

/*

/comments/:id

DELETE

-Receives comment ID from URL parameter

-Deletes comment from database and removes all references to its ID from corresponding user and article models, returns 204 response

-If no ID is supplied or comment with supplied ID doesn't exist, returns 400 response

 */

function deleteComment(url, request) {
	const id = Number(url.split('/').filter(segment => segment)[1]);
	const savedComment = database.comments[id];
	const response = {};

	if (savedComment) {
    const article = savedComment.articleId;
    const articleCommentIds = database.articles[article].commentIds;
    const user = savedComment.username
    const userCommentIds = database.user.commentIds;
    console.log(userCommentIds);
	  articleCommentIds.splice(articleCommentIds.indexOf(id), 1);
	  userCommentIds.splice(userCommentIds.indexOf(id), 1);
	  savedComment = null;
	  response.status = 204;
	} else {
	  response.status = 400;
	}

	return response;
}

