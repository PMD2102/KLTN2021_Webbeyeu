import {
  Box,
  Button,
  Checkbox,
  Divider,
  HStack,
  Icon,
  Input,
  Text,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { FaFacebookF } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import setTabName from 'utils/setTabName';
import { useForm } from 'react-hook-form';
import http from 'utils/http';
import jwtDecode from 'jwt-decode';
import ToastNotify from 'components/common/ToastNotify';
import { GlobalContext } from 'context/GlobalContext';
import FacebookSignIn from './FacebookSignIn';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = () => {
  const { setCurrentUser } = useContext(GlobalContext);
  const [typePass, setTypePass] = useState(false);
  const [name, setName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignUp = data => {
    if (!Object.keys(errors).length) {
      if (name.split(' ').length < 2) return;
      http
        .post('/users/sign-up', data)
        .then(res => {
          ToastNotify({
            title: 'Đăng ký thành công',
            status: 'success',
          });
          const { token } = res.data;
          localStorage.setItem('token', token);
          const decoded = jwtDecode(token);
          setCurrentUser(decoded);
        })
        .catch(err => {
          console.log(err.response.data);
          let errMessage = err.response?.data;
          if (errMessage) {
            ToastNotify({
              title: errMessage.toString(),
              status: 'warning',
            });
          }
        });
    }
  };

  useEffect(() => {
    setTabName('Đăng ký');
  }, []);

  return (
    <Box bg="white" w="30em" p="1em" textAlign="left" borderRadius="md">
      <Text fontSize="2xl" fontWeight="800">
        Đăng ký
      </Text>
      <form onSubmit={handleSubmit(handleSignUp)}>
        <Box pos="relative" pb="0.5em">
          <Input
            id="name"
            {...register('name', { required: true, maxLength: 50 })}
            value={name}
            onChange={e => setName(e.target.value)}
            my="0.5em"
            placeholder="Họ tên"
          />
          {(errors.name || name) && (
            <Text
              pos="absolute"
              left="0"
              bottom="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.name?.type === 'required'
                ? 'Họ và tên là bắt buộc'
                : errors.name?.type === 'maxLength'
                ? 'Họ và tên có độ dài dài nhất 50 ký tự'
                : name.split(' ').length < 2
                ? 'Họ và tên ít nhất có 2 từ'
                : ''}
            </Text>
          )}
        </Box>
        <Box pos="relative" pb="0.5em">
          <Input
            id="username"
            {...register('username', { required: true, maxLength: 30, minLength: 8 })}
            my="0.5em"
            placeholder="Tên đăng nhâp"
          />
          {errors.username && (
            <Text
              pos="absolute"
              left="0"
              bottom="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.username?.type === 'required'
                ? 'Tên đăng nhập  là bắt buộc'
                : errors.username?.type === 'minLength'
                ? 'Tên đăng nhập có độ dài ít nhất 8 ký tự'
                : errors.username?.type === 'maxLength'
                ? 'Tên đăng nhập có độ dài dài nhất 30 ký tự'
                : ''}
            </Text>
          )}
        </Box>
        <Box pos="relative" pb="0.5em">
          <Input
            id="password"
            {...register('password', { 
              required: true, 
              maxLength: 20, 
              minLength: 8, 
              pattern: /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/ 
            })}
            my="0.5em"
            type={ typePass ? "text" : "password" }
            placeholder="Mật khẩu"
          />
          {errors.password && (
            <Text
              pos="absolute"
              left="0"
              bottom="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.password?.type === 'required'
                ? 'Mật khẩu là bắt buộc'
                : errors.password?.type === 'maxLength'
                ? 'Mật khẩu tối đa 20 ký tự'
                : errors.password?.type === 'minLength'
                ? 'Mật khẩu tối thiểu 8 ký tự'
                : errors.password?.type === 'pattern'
                ? "Mật khẩu chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt"
                : ''}
            </Text>
          )}
          <small 
            style={{
              position: "absolute",
              top: "40%",
              right: "5px",
              transform:  "translateY(-50%)",
              cursor: "pointer",
              opacity: "0.5",
              zIndex:"1",
              fontSize:"20px"
            }} 
              onClick={() => setTypePass(!typePass)}
            >
              {typePass ? <FaEyeSlash />: <FaEye />}
          </small>
        </Box>
        <Box pos="relative" pb="0.5em">
          <Input
            id="email"
            {...register('email', {
              required: true,
              pattern: /^\S+\@\S+$/gi,
            })}
            my="0.5em"
            placeholder="Email"
          />
          {errors.email && (
            <Text
              pos="absolute"
              left="0"
              bottom="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.email?.type === 'required'
                ? 'Email là bắt buộc'
                : errors.email?.type === 'pattern'
                ? 'Email không hợp lệ'
                : ''}
            </Text>
          )}
        </Box>

        <Text fontSize="md">
          Bằng việc bấm vào "ĐĂNG KÝ", bạn đồng ý rằng bạn đã đọc, hiểu và đồng
          ý với các điều khoản và điều kiện được quy định tại Thoả Thuận Về Điều
          Khoản và Điều Kiện Sử Dụng và Chính Sách Bảo Mật của chúng tôi.
        </Text>

        <Button
          bg="blue.700"
          color="white"
          my="0.5em"
          _hover={{ bg: 'blue.600' }}
          type="submit"
        >
          Đăng ký
        </Button>
      </form>


      {/* <Text>Ngày sinh</Text>
      <HStack>

      </HStack> */}

      <Divider my="0.5em" />

      <Text fontSize="md">Hoặc đăng nhập qua</Text>
      <FacebookSignIn />

      <HStack fontSize="md">
        <Text>Bạn đã có tài khoản Webtretho?</Text>
        <Link to="/dang-nhap">
          <Text fontWeight="600">Đăng nhập</Text>
        </Link>
      </HStack>
    </Box>
  );
};

export default SignUp;
