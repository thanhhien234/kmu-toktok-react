import { useEffect } from "react";
import { useCookies } from 'react-cookie';
import { loginApi } from '../api/authApi';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';

function useLogin() {
  const [cookies, setCookie] = useCookies(['accessToken', 'refreshToken', 'isActive']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const { option } = useParams(); 

  useEffect(() => {
    if (code && option) {
      console.log('login call');
        loginApi(code, option)
            .then((response) => {
            setCookie("accessToken", response.data.accessToken, { path: '/', maxAge: 2 * 60 * 60 });
            setCookie("refreshToken", response.data.refreshToken, { path: '/', maxAge: 24 * 7 * 60 });
            setCookie('isActive', response.data.registerStateEnum, { path: '/', maxAge: 2 * 60 * 60 });
            })
            .catch((error) => {
              console.log(error.message);
              alert('잘못된 접근입니다.');
              navigate('/');
            });
    }
  }, [code, option]);

  useEffect(() => {
    if (cookies.accessToken && cookies.isActive === 'ACTIVE') {
      console.log('login success');
      navigate('/chatbot');
    }
    else{
      console.log('goto register');
      navigate('/register');
    }
  }, [cookies]);

}

export default useLogin;
