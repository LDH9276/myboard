import React, { useEffect, useTransition, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useSelector, useDispatch } from 'react-redux';
import CustomEditor from '@ckeditor/ckeditor5-custom';
import WriteComment from './WriteComment';
import CommentList from './CommentList';
import ListModules from './ListModules';
import ListModule from './ListModule';
import BestCommentList from './BestCommentList';
import Dompurify from "dompurify";
import './css/read.css';
import { Tweet } from 'react-twitter-widgets';

function Read( {userId} ) {
  
  const { id } = useParams();
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const content = useSelector(state => state.content);
  const boardId = useSelector(state => state.boardId);
  const boardName = useSelector(state => state.boardName);
  const writer = useSelector(state => state.writer);
  const [like, setLike] = useState(false);
  const [likeClickTime, setLikeClickTime] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [updateDate, setUpdateDate] = useState('');
  const [totalLike, setTotalLike] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [contents, setContents] = useState([]);
  const [boardCate, setBoardCate] = useState('*');
  const [boardList, setBoardList] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [postCategory, setPostCategory] = useState([]);
  const [twitterNumber, setTwitterNumber] = useState([]);

  const readBoard = async () => {
    try {
      const response = await axios.post(`${boardLink}?id=${boardId}`);
      setBoardList(response.data.boardlist);
      setPostCategory(response.data.boardlist[0].board_category);
    } catch (error) {
      console.error(error);
    }
  }

  // Writer info
  const [WriterName, setWriterName] = useState('');
  const [WriterProfile, setWriterProfile] = useState('');
  const [WriterProfileImg, setWriterProfileImg] = useState('');
  
  // Link
  const postWriteLink = "http://leedh9276.dothome.co.kr/board_api/Board/Post_Write.php"
  const contentChek = "http://leedh9276.dothome.co.kr/board_api/Board/Post_Read.php"
  const postLikeLink = "http://leedh9276.dothome.co.kr/board_api/Board/Post_Like.php"
  const postLikeChek = "http://leedh9276.dothome.co.kr/board_api/Board/Post_CheckLike.php"
  const writerInfo = "http://leedh9276.dothome.co.kr/board_api/Board/Post_WriterInfo.php"
  const boardLink = "http://leedh9276.dothome.co.kr/board_api/Board/Board_ListCheck.php";

  useEffect(() => {
    readBoard();
  }, [userId]);

  const readContent = async () => {
    try {
      const response = await axios.get(`${contentChek}?id=${id}`);

      const list = response.data.list.map(item => {
        item.content = item.content.replace(/\\/g, '');
        return item;
      });

      const searchContent = list[0].content;
      const regex = /https:\/\/twitter\.com\/\w+\/status\/(\d+)/g;
      const twitterNumbers = [];
      const spanRegex = /<span[^>]*>(.*?)<\/span>/g;
      let match;
      let spanContent = searchContent;
      while ((match = spanRegex.exec(searchContent)) !== null) {
        spanContent = spanContent.replace(match[0], match[1]);
      }
      while ((match = regex.exec(spanContent)) !== null) {
        twitterNumbers.push(match[1]);
      }
      console.log(twitterNumbers);
      setTwitterNumber(twitterNumbers);
      
      dispatch({type: 'READ', payload: {writer : list[0].writer, content: list}});
      setContents(list[0].content);
      setUpdateDate(list[0].reg_date);
      setTotalLike(list[0].total_like);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   console.log(twitterNumber);
  // }, [twitterNumber]);

  const readLike = async () => {
    try {
      const formdata = new FormData();
      formdata.append('id', id);
      formdata.append('user_id', userId);
      const response = await axios.post(postLikeChek, formdata);
      if(response.data.like_status) {
        setLike(true);
      } else {
        setLike(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const readWriterInfo = async () => {
    try {
      const formdata = new FormData();
      formdata.append('writer', writer);
      const response = await axios.post(writerInfo, formdata);
      setWriterName(response.data.name);
      setWriterProfile(response.data.profile);
      setWriterProfileImg(response.data.profile_name + '.' + response.data.profile_ext);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    startTransition(() => {
      readContent();
    });
  }, []);

  useEffect(() => {
    startTransition(() => {
      readContent();
    });
  }, [id]);

  useEffect(() => {
    readWriterInfo();
  }, [writer]);

  useEffect(() => {
    readLike();
  }, [userId]);

  const onDleteBtnClick = () => {
    if(window.confirm('정말로 삭제하시겠습니까?')){
      deletePost();
    } else {
      return;
    }
  };

  const deletePost = async () => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('delete', true);
    axios.post(postWriteLink, formData)
    .then((res) => {
      alert('삭제 완료');
      navigate('/');
    })
    .catch((err) => {
      console.error(err);
      alert('삭제 실패');
    });
  };

  const handleLikeAction = () => {

    // 이전 함수가 실행된지 3초 이내라면 실행하지 않음
    const now = new Date();
    if(now - likeClickTime < 1500) {
      console.log('3초 이내에는 실행할 수 없습니다.');
      return;
    } else {

      if(like) {
        setLike(false);
        const now = new Date();
        setLikeClickTime(now);
        setTotalLike(totalLike - 1);
        const formData = new FormData();
        formData.append('id', id);
        formData.append('user_id', userId);
        formData.append('like', false);
        axios.post(postLikeLink, formData)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err.data);
        });

      } else {
        setLike(true);
        const now = new Date();
        setLikeClickTime(now);
        setTotalLike(totalLike + 1);
        const formData = new FormData();
        formData.append('id', id);
        formData.append('user_id', userId);
        formData.append('like', true);
        axios.post(postLikeLink, formData)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err.data);
        });
      }
    }
  };

  const PostUpdateDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    // 1분 이내는 방금 전으로 표시
    if(now.getTime() - postDate.getTime() < 60000){
      return '방금 전';
    }
    // 1시간 이전은 분으로 표시
    else if(now.getTime() - postDate.getTime() < 3600000){
      return Math.floor((now.getTime() - postDate.getTime()) / 60000) + '분 전';
    }
    // 24시간 이전은 시간으로 표시
    else if(now.getTime() - postDate.getTime() < 86400000){
      return Math.floor((now.getTime() - postDate.getTime()) / 3600000) + '시간 전';
    }
    // 나머지는 xx년 xx월 xx일로 표시
    else {
      const postYear = postDate.getFullYear().toString().substr(2, 2);
      return postYear + '년 ' + (postDate.getMonth() + 1) + '월 ' + postDate.getDate() + '일';
    }
  }

  return (
    <div className='board-container'>
      <ul>
          <li className='board_title'>
            <Link to ={`/board/${boardId}`}>
              <h2>{boardName}</h2>
            </Link>
          </li>
          <li>
            <div className="read-writer-wrap">
              <div className="read-writer-profile">
                <img src={`http://leedh9276.dothome.co.kr/board_api/Users/Profile/${WriterProfileImg}`} alt="profile" className='read-profile-img'/>
                <div className="read-wtire-text">
                  <p className='read-profile-name'>{WriterName}</p>
                  <p className='read-profile-time'>{PostUpdateDate(updateDate)}</p>
                </div>
              </div>
              <div className="read-title-wrap">
                <h3>{content ? content[0].title : ''}</h3>
              </div>
              

            </div>
        {Array.isArray(content) && content.map(item => (
          <div className="read-content-wrap" key={item.id}>
            <div dangerouslySetInnerHTML={{__html : Dompurify.sanitize(item.content, { ADD_TAGS: ["iframe", "script"], ADD_ATTR: [ 'async', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'charset'] })}} className='read-content' />
            {twitterNumber.length > 0 ? (
            <div className="read-twitter-wrap">
            {twitterNumber.map((tweet, index) => (
              <div key={index}>
                <Tweet  tweetId={tweet} />
              </div>
            ))}
            </div>
          ) : ''}
          </div>
        ))}
        </li>
      </ul>

      {writer === userId ? (
        <>
          <button onClick={() => navigate(`/write/${id}/modify`)}>수정</button>
          <button onClick={onDleteBtnClick}>삭제</button>
        </>
      ) : null}

      {/* <button onClick={() => navigate(`/board/${boardId}`)}>목록으로</button> */}
      
      <div className="comment">
        <BestCommentList id={id} />
        {isPending ? (
          <p>Loading...</p>
        ) : (
          <CommentList id={id} userId={userId} />
        )}
        {isLoggedIn ? (
          <WriteComment id={id} />
        ) : ( '' )}
      </div>

      {isLoggedIn ? (
        <div className="board-bottom-wrap">
          <button onClick={() => handleLikeAction()} className='board-like-btn'>
            <div className="bottom-like-wrap">
              <img src={`${process.env.PUBLIC_URL}/btn/like_btn.svg`} alt="write" className='bottom-like_back'/>
              <img src={`${process.env.PUBLIC_URL}/btn/like.svg`} alt="write" className={like ? 'bottom-like_icon active' : 'bottom-like_icon'} />
            </div>
            <span>{content ? totalLike : '0'}</span>
          </button>
          <button onClick={() => navigate('/write')} className='main-write-btn'>
            <img src={`${process.env.PUBLIC_URL}/btn/write.svg`} alt="write" />
          </button>
        </div>) : ''}
        <ListModule setBoardCate={setBoardCate} postCategory={postCategory} boardCate={boardCate} setAutoRefresh={setAutoRefresh} autoRefresh={autoRefresh} /> 
        <ListModules  boardId={boardId} postCategory={postCategory} boardCate={boardCate} autoRefresh={true}/>
    </div>
  );
}

export default Read;