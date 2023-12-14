import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase, Avatar } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import useStyles from './styles';
import { deletePost, likePost, getPost } from '../../../actions/posts';

const Post = ({ post, setCurrentId }) => {

  const [likes, setLikes] = useState(post?.likes);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem('profile'));

  const userId = user?.result.googleId || user?.result?._id;
  const hasLikedPost = post?.likes?.find((like) => like === userId);

  const handleLike = async () => {
    dispatch(likePost(post._id));

    if (hasLikedPost) {
      setLikes(post.likes.filter((id) => id !== userId));
    } else {
      setLikes([...post.likes, userId]);
    }
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId)
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };

  const openPost = (e) => {
    dispatch(getPost(post._id, history));

    history.push(`/posts/${post._id}`);
  };

  return (
    <Card className={classes.card} >
      <ButtonBase
        component="span"
        name="test"
        className={classes.cardAction}
        onClick={openPost}
      >
        <div className={classes.overlay}>
          <div className={classes.overlay2}>
            <Avatar alt={user?.result?.name} src={user?.result?.imageUrl}>
              {user?.result?.name?.charAt(0)}
            </Avatar>
            <div className={classes.overlay3}>
              <Typography variant="h6" style={{ marginLeft: "10px" }}>{post.name}</Typography>
              <Typography variant="body4" className={classes.createdAt}>{moment(post.createdAt).fromNow()}</Typography>
            </div>
          </div>
          {((user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && typeof setCurrentId !== "undefined") && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentId(post._id);
              }}
              style={{ color: 'black' }}
              size="small"
            >
              <MoreHorizIcon fontSize="medium" />
            </Button>
          )}
        </div>
        <div className={classes.content}>
          <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {post.message ? post.message.split(' ').splice(0, 20).join(' ') : ''}...
          </Typography>

          {(post.tags.length > 1) && (
            <div className={classes.details}>
              <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
            </div>
          )}
        </div>
        <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
      </ButtonBase>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
          <Likes />
        </Button>
        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
          <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
            <DeleteIcon fontSize="small" /> &nbsp; Delete
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default Post