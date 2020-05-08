import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [Dislikes, setDislikes] = useState(0);
  const [DisLikeAction, setDisLikeAction] = useState(null);

  let variable = {};

  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
    console.log("video");
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
    console.log("comment");
  }

  useEffect(() => {
    Axios.post("/api/like/getLikes", variable).then((res) => {
      if (res.data.success) {
        console.log(res.data);
        setLikes(res.data.likes.length);

        res.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      } else {
        alert("likes 에 정보를 가져오지 못했습니다.");
      }
    });

    Axios.post("/api/like/getDislikes", variable).then((res) => {
      if (res.data.success) {
        console.log(res.data);
        setDislikes(res.data.dislikes.length);

        res.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDisLikeAction("disliked");
          }
        });
      } else {
        alert("dislikes 에 정보를 가져오지 못했습니다.");
      }
    });
  }, []);

  const onLike = () => {
    if (LikeAction === null) {
      Axios.post("/api/like/upLike", variable).then((res) => {
        if (res.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");
          if (DisLikeAction !== null) {
            setDisLikeAction(null);
            setDislikes(Dislikes - 1);
          }
        } else {
          alert("좋아요를 실패했씁니당");
        }
      });
    } else {
      Axios.post("/api/like/unLike", variable).then((res) => {
        if (res.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert("좋아요를 내리지 못하였습니다.");
        }
      });
    }
  };

  const onDislike = () => {
    if (DisLikeAction !== null) {
      Axios.post("/api/like/unDislike", variable).then((res) => {
        if (res.data.success) {
          setDislikes(Dislikes - 1);
          setDisLikeAction(null);
        } else {
          alert("dislike을 지우지 못했습니다.");
        }
      });
    } else {
      Axios.post("/api/like/upDislike", variable).then((res) => {
        if (res.data.success) {
          setDislikes(Dislikes + 1);
          setDisLikeAction("disliked");
          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert("dislike을 지우지 못했습니다.");
        }
      });
    }
  };

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={LikeAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}> {Likes}</span>
      </span>
      &nbsp;&nbsp;
      <span key="comment-basic-dislike">
        <Tooltip title="Disike">
          <Icon
            type="dislike"
            theme={DisLikeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}> {Dislikes}</span>
      </span>
      &nbsp;&nbsp;
    </div>
  );
}

export default LikeDislikes;
