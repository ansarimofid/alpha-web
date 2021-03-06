import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import styles from './styles.scss';
import indexStyles from '../../styles/globals.scss';
import {
  getUserFeeds, loadUserProfileInfo,
} from '../actions';
import { loadHaprampUserDetails } from '../../actions/allUserActions';
import { getFollowers, getFollowing } from '../../follow/actions';
import UserCoverImage from '../UserCoverContainer';
import FollowButton from '../../follow/FollowButton';
import { getAuthUsername } from '../../reducers/authUserReducer';
import UserDataCount from './UserDataCount';
import { getUserProfile, isProfileMetaLoading, getUserJSONMetadata, getUserName } from '../reducer';
import UserCommunities from './UserCommunities';
import UserBlog from './UserBlog';
import EditProfileButton from '../EditProfile/EditProfileButton';
import UserProfileMetaTags from './UserProfileMetaTags';

class UserProfile extends React.Component {
  componentDidMount() {
    const { username } = this.props;
    this.makeNetworkCalls(username);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.username !== newProps.username) {
      this.makeNetworkCalls(newProps.username);
    }
  }

  makeNetworkCalls = (username) => {
    this.props.loadUserProfileInfo(username);
    this.props.getFollowers(username);
    this.props.getFollowing(username);
    this.props.loadHaprampUserDetails(username);
  }

  render() {
    if (this.props.isLoading) {
      return (
        <div className={['uk-position-center'].join(' ')}>
          LOADING
        </div>
      );
    }
    const { jsonMetadata } = this.props;

    jsonMetadata.profile = get(jsonMetadata, 'profile', {});
    const { username } = this.props;

    return (
      <div className="uk-margin-small-top">
        {/* Cover image and user avatar */}
        <UserProfileMetaTags user={{ name: username, json_metadata: jsonMetadata }} />
        <div className={`${indexStyles.white}`}>
          <UserCoverImage username={username} coverImageUrl={jsonMetadata.profile.cover_image} />

          <div className={`${indexStyles.white} ${styles.userMeta}`}>

            {/* Name and username */}
            <div className={['uk-text-center', 'uk-margin-top'].join(' ')}>
              <div>
                <span className={styles.userName}>{jsonMetadata.profile.name}</span>
                <span className="uk-margin-small-left">@{this.props.name}</span>
              </div>
            </div>

            {/* (Un)Follow button */}
            {
              username === this.props.authUsername
                ? (
                  <div className="uk-text-center">
                    <EditProfileButton />
                  </div>
                )
                : <FollowButton following={username} />
            }

            {/* Data count */}
            <UserDataCount username={username} />

            {/* User Bio */}
            <div className={['uk-margin-top', 'uk-margin-bottom', 'uk-flex', 'uk-flex-center'].join(' ')}>
              <div className={['uk-text-center', styles.bio].join(' ')}>
                {jsonMetadata.profile.about || 'No bio provided.'}
              </div>
            </div>

            <UserCommunities username={username} />
          </div>
        </div>

        {/* User posts */}
        <UserBlog username={username} />
      </div>);
  }
}

UserProfile.propTypes = {
  loadUserProfileInfo: PropTypes.func,
  username: PropTypes.string.isRequired,
  getFollowers: PropTypes.func,
  getFollowing: PropTypes.func,
  loadHaprampUserDetails: PropTypes.func,
  authUsername: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  jsonMetadata: PropTypes.shape({}),
  name: PropTypes.string.isRequired,
};

UserProfile.defaultProps = {
  loadUserProfileInfo: () => { },
  getFollowers: () => { },
  getFollowing: () => { },
  loadHaprampUserDetails: () => { },
  jsonMetadata: {},
};

const mapStateToProps = (state, ownProps) => ({
  userProfile: getUserProfile(state, ownProps.username),
  authUsername: getAuthUsername(state),
  isLoading: isProfileMetaLoading(state, ownProps.username),
  jsonMetadata: getUserJSONMetadata(state, ownProps.username),
  name: getUserName(state, ownProps.username),
});

export default connect(mapStateToProps, {
  loadUserProfileInfo,
  getUserFeeds,
  loadHaprampUserDetails,
  getFollowers,
  getFollowing,
})(UserProfile);
