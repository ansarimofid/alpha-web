import steemAPI from '../../utils/steem';

export const actionTypes = {
	REPLIES_LOAD_INIT: 'REPLIES.LOAD.INIT',
	REPLIES_LOAD_DONE: 'REPLIES.LOAD.DONE',
	REPLIES_LOAD_ERROR: 'REPLIES.LOAD.ERROR',
	ADD_REPLY_INIT: 'REPLIES.ADD.INIT',
	ADD_REPLY_DONE: 'REPLIES.ADD.DONE',
	ADD_REPLY_ERROR: 'REPLIES.ADD.ERROR',
};

export const loadReplies = (parentAuthor, parentPermlink) => dispatch => {
	dispatch({type: actionTypes.REPLIES_LOAD_INIT, parentAuthor, parentPermlink});
	steemAPI.getReplies(parentAuthor, parentPermlink)
		.then(results => dispatch({type: actionTypes.REPLIES_LOAD_DONE, parentAuthor, parentPermlink, results}))
		.catch(reason => dispatch({type: actionTypes.REPLIES_LOAD_ERROR, parentAuthor, parentPermlink, reason}));
}
