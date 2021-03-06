import React, { useState } from 'react';
import PropTypes from 'prop-types';
import take from 'lodash/take';
import InfiniteScroll from 'react-infinite-scroller';
import ScrollBar from 'react-custom-scrollbars';

import BodyModal from '../../components/BodyModal';
import Icon from '../../icons/Icon';
import RatingCard from './RatingCard';
import styles from './styles.scss';

const itemsPerPage = 20;
const noOp = () => { };

const PostRatings = ({
  ratings, showRatings, onClose, postValue,
}) => {
  // Sort - desc rshares
  const sortedRatings = ratings.sort((ratingA, ratingB) => ratingB.rshares - ratingA.rshares);
  let totalRshares = 1;
  if (showRatings) { // Do not calculate total rshares if rating is not shown
    totalRshares = sortedRatings.reduce((acc, curr) => acc + parseInt(curr.rshares, 10), 0);
  }
  // Will be used in children components to display vote value
  const ratio = postValue / totalRshares;

  /**
   * If a post contains way too many ratings, it takes long
   * before all of them are rendered in the DOM. To prevent
   * this, we paginate the ratings with a page size of
   * 'itemsPerPage'.
   *
   * 'displayCount' keeps track of the number of ratings
   * to be rendered. It is set initially to 0 so that no
   * ratings are rendered when the overlay is inactive
   */
  const [displayCount, changeDisplayCount] = useState(0);
  return (
    /**
     * The document starts scrolling once the modal is
     * scrolled to bottom. To prevent this, disable document
     * scrolling once the modal is active and enable
     * it again when done
     */
    <BodyModal
      isOpen={showRatings}
      onRequestClose={onClose}
      className={`uk-position-center ${styles.modalContainer}`}
    >
      <div className={styles.heading}>
        <span>Ratings</span>
        <span>
          <Icon name="cancel" type="outline" onClick={onClose} />
        </span>
      </div>
      <div className={`${styles.ratingContainer}`}>
        <ScrollBar autoHeight autoHeightMax="65vh">
          <InfiniteScroll
            pageStart={0}
            loadMore={() => changeDisplayCount(displayCount + itemsPerPage)}
            hasMore={displayCount < sortedRatings.length}
            // Can't use window as it will result in rendering everything at once
            useWindow={false}
            className={styles.ratingListContainer}
          >
            {
              take(sortedRatings, displayCount).map(rating => (
                <RatingCard
                  ratio={ratio} // To calculate vote value
                  ratingObject={rating}
                  key={rating.voter}
                />
              ))
            }
          </InfiniteScroll>
        </ScrollBar>
      </div>
    </BodyModal>
  );
};

PostRatings.propTypes = {
  ratings: PropTypes.arrayOf(PropTypes.bool),
  showRatings: PropTypes.bool,
  onClose: PropTypes.func,
  postValue: PropTypes.number,
};

PostRatings.defaultProps = {
  ratings: [],
  showRatings: false,
  onClose: noOp,
  postValue: 0.0,
};

export default PostRatings;
