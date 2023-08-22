import axios from 'axios';

// Sign 컴포넌트에서 사용할 API 함수
export const sendSignRequest = async (id, password, name, email, profile) => {

  // 로그인 체크 PHP 파일의 경로 (빌드 전 수정할 것.)
  const SignCheckPHP = 'http://localhost/JTW_testing/Sign_Check.php';

  // FormData로 POST 전송을 보낸다. ID, PW
  const formData = new FormData();
  formData.append('id', id);
  formData.append('password', password);
  formData.append('name', name); //$_POST['name'] : name변수
  formData.append('email', email);
  formData.append('profile', profile);

  try { // 서버로부터 응답을 전송한다.
    const response = await axios.post(SignCheckPHP, formData);
    return response.data;
  } catch (error) { // 서버로부터 응답이 없거나, 응답이 에러인 경우
    console.error(error);

    if (error.response) { // 서버로부터 응답이 있지만, 에러인 경우
      const { data, status } = error.response;
      console.error(`Status code: ${status}`);
      console.error(`Error message: ${data.error}`);
      throw new Error(data.error);
    } else if (error.request) { // 서버로부터 응답이 없는 경우
      console.error('No response received from server');
      throw new Error('An error occurred while logging in.');
    } else { // 서버로부터 응답이 없는 경우
      console.error('Error in sending request:', error.message);
      throw new Error('An error occurred while logging in.');
    }
  }
};