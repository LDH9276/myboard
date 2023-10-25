import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';

function Mypage( {userId} ) {

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profile, setProfile] = useState('');
    const [modify, setModify] = useState(false);

    const [profileImg, setProfileImg] = useState('');
    const [profileImgName, setProfileImgName] = useState('');
    const imgRef = useRef();


    // FormData로 POST 전송을 보낸다. ID, PW
    const profileCheck = () => {
        const formData = new FormData();
        formData.append('id', userId);
    
        axios.post('http://localhost/myboard_serverl/Users/mypage.php', formData)
        .then((res) => {
            console.log(res.data);
            setId(res.data.id);
            setName(res.data.name);
            setEmail(res.data.email);
            setProfile(res.data.profile);
            setProfileImg(res.data.profile_img);
        })
        .catch((err) => {
            console.error(err);
        });
    }

    const profileUpdate = async () => {
        const formData = new FormData();
        formData.append('id', userId);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('profile', profile);
        axios.post('http://localhost/myboard_serverl/Users/mypage_update.php', formData)
        .then((res) => {
            if(res.data.success === false){
                alert(res.data.message);
                setModify(false);
                return;
            } else {
                alert('수정 완료');
                profileCheck();
                setModify(false);
            }
        })
        .catch((err) => {
            console.error(err);
            alert('수정 실패');
        });
    };

    useEffect(() => {
        profileCheck();
    }, []);


    return (
        <div>
            {!modify ? (
                <ul>
                    <li>
                        <img src={profileImg} alt="프로필사진"/>
                    </li>

                    <li>
                        <p>유저ID</p>
                        <p>{id}</p>
                    </li>
                    <li>
                        <p>유저이름</p>
                        <p>{name}</p>
                    </li>
                    <li>
                        <p>자기소개</p>
                        <p>{profile}</p>
                    </li>
                    <li>
                        <p>이메일</p>
                        <p>{email}</p>
                    </li>
                    <li>
                        <button onClick={() => setModify(true)}>수정</button>
                    </li>
                </ul>   
            ) : (
                <ul>
                    <li>
                        <p>유저ID</p>
                        <p>{id}</p>
                    </li>
                    <li>
                        <p>유저이름</p>
                        <input type="text" onChange={(e) => setName(e.target.value)} value={name}/>
                    </li>
                    <li>
                        <p>이메일</p>
                        <input type="text" onChange={(e) => setEmail(e.target.value)} value={email}/>
                    </li>
                    <li>
                        <p>자기소개</p>
                        <input type="text" onChange={(e) => setProfile(e.target.value)} value={profile}/>
                    </li>
                    <li>
                        <button onClick={() => setModify(false)}>수정취소</button>
                        <button onClick={() => profileUpdate()}>수정</button>
                    </li>
                </ul>   
            )
            }
        </div>
    );
}

export default Mypage;