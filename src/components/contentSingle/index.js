import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loadPost } from '../../actions/allPostsActions';
import PostSingle from '../postSingle';
import ArticleSingle from '../articleSingle';

class ContentSingle extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadPost(this.props.match.params.username, this.props.match.params.permlink);
  }

  render() {
    if (!this.props.post) {
      return <div className={['uk-container', 'uk-margin-top'].join(' ')}>Loading...</div>;
    }

    return (
      <div className={['uk-container', 'uk-margin-top'].join(' ')}>
        {this.props.post.json_metadata.content.type === 'post' ?
          <PostSingle postPermlink={`${this.props.post.author}/${this.props.post.permlink}`} /> :
          <ArticleSingle postPermlink={`${this.props.post.author}/${this.props.post.permlink}`} />}
      </div>);
  }
}

ContentSingle.propTypes = {
  post: PropTypes.shape({
    json_metadata: PropTypes.shape({
      content: PropTypes.shape({
        type: PropTypes.string,
      }),
    }),
    author: PropTypes.string,
    permlink: PropTypes.string,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string,
      permlink: PropTypes.string,
    }),
  }),
  loadPost: PropTypes.func,
};

ContentSingle.defaultProps = {
  post: {
    json_metadata: {
      content: {
        type: 'post',
      },
    },
    author: '',
    permlink: '',
  },
  match: {
    params: {
      username: '',
      permlink: '',
    },
  },
  loadPost: () => {},
};

const mapStateToProps = (state, ownProps) => ({
  post: state.allPosts.posts[`${ownProps.match.params.username}/${ownProps.match.params.permlink}`],
});

export default connect(mapStateToProps, {
  loadPost,
})(ContentSingle);
