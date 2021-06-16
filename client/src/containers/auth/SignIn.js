import {
  Box,
  Button,
  Divider,
  HStack, Input,
  Text
} from '@chakra-ui/react';
import ToastNotify from 'components/common/ToastNotify';
import { GlobalContext } from 'context/GlobalContext';
import jwtDecode from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import http from 'utils/http';
import setTabName from 'utils/setTabName';
import FacebookSignIn from './FacebookSignIn';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignIn = () => {
  const { setCurrentUser } = useContext(GlobalContext);
  const [typePass, setTypePass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignIn = data => {
    if (!Object.keys(errors).length) {
      http
        .post('/users/sign-in', data)
        .then(res => {
          const { token } = res.data;
          localStorage.setItem('token', token);
          const decoded = jwtDecode(token);
          console.log(decoded);;
          setCurrentUser(decoded);
        })
        .catch(err => {
          console.log(err);
          const errMessage = err.response?.data;
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
    setTabName('Đăng nhập');
  }, []);

  return (
    <Box bg="white" w="30em" p="1em" textAlign="left" borderRadius="md">
      <Text fontSize="2xl" fontWeight="800">
        Đăng nhập
      </Text>

      <form onSubmit={handleSubmit(handleSignIn)}>
        <Box pos="relative" pb="0.5em">
          <Input
            id="username"
            {...register('username', { required: true})}
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
                // : errors.username?.type === 'minLength'
                // ? 'Tên đăng nhập có độ dài ít nhất 8 ký tự'
                // : errors.username?.type === 'maxLength'
                // ? 'Tên đăng nhập có độ dài dài nhất 30 ký tự'
                : ''}
            </Text>
          )}
        </Box>
        <Box pos="relative" pb="0.5em">
          <Input
            id="password"
            {...register('password', { 
              required: true, 
              // maxLength: 20, 
              // minLength: 8, 
              // pattern: /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/ 
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
                // : errors.password?.type === 'maxLength'
                // ? 'Mật khẩu tối đa 20 ký tự'
                // : errors.password?.type === 'minLength'
                // ? 'Mật khẩu tối thiểu 8 ký tự'
                // : errors.password?.type === 'pattern'
                // ? "Mật khẩu chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt"
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
              zIndex: "1",
              fontSize: "20px"
            }} 
              onClick={() => setTypePass(!typePass)}
            >
              {typePass ? <FaEyeSlash />: <FaEye />}
           </small>
        </Box>

        <Button
          bg="blue.700"
          color="white"
          my="0.5em"
          _hover={{ bg: 'blue.600' }}
          type="submit"
        >
          Đăng nhập
        </Button>
      </form>

      <Link to='./lay-lai-mat-khau'>
        <Text fontSize="sm" color="blue.800" fontWeight="500">
          Quên mật khẩu?
        </Text>
      </ Link>

      <Divider my="0.5em" />
      <Text fontSize="md">Hoặc đăng nhập qua</Text>
      <FacebookSignIn />

      <HStack fontSize="md">
        <Text>Bạn chưa có tài khoản Webtretho?</Text>
        <Link to="/dang-ky">
          <Text fontWeight="600">Đăng ký</Text>
        </Link>
      </HStack>
    </Box>
  );
};

export default SignIn;
