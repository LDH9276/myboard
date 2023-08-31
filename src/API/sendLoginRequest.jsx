import axios from 'axios';

// Login 컴포넌트에서 사용할 API 함수
export const sendLoginRequest = async (id, password) => {

  // 로그인 체크 PHP 파일의 경로 (빌드 전 수정할 것.)
  const loginCheckPHP = 'http://localhost/myboard_server/Login_Check.php';

  // FormData로 POST 전송을 보낸다. ID, PW
  const formData = new FormData();
  formData.append('id', id);
  formData.append('password', password);

  try { // 서버로부터 응답을 전송한다.
    const response = await axios.post(loginCheckPHP, formData);
    return response.data;
  } catch (error) { // 서버로부터 응답이 없거나, 응답이 에러인 경우
    console.error(error);

    if (error.response) { // 서버로부터 응답이 있지만, 에러인 경우
      const { data, status } = error.response;
      console.error(`Status code: ${status}`);
      console.error(`Error message: ${data.error}`);
      throw new Error(data.error);
    } else if (error.request) { // 서버로부터 응답이 없는 경우
      console.error('서버로부터 응답이 없습니다. 서버가 실행 중인지 확인해주세요.');
      throw new Error('로그인 중 에러가 발생했습니다.');
    } else { // 서버로부터 응답이 없는 경우
      console.error('에러발생:', error.message);
      throw new Error('로그인 중 에러가 발생했습니다.');
    }
  }
};