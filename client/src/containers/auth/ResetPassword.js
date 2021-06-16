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

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
    const handleResetPassword = data => {
        http
          .post(`/users/reset-password`, data)
          .then(res => {
            ToastNotify({
              title: 'Email chứa mật khẩu đã được gửi tới email của người dùng',
              status: 'success',
            });
          })
          .catch(err => {
            let errMessage = err.response?.data;
            if (errMessage) {
                ToastNotify({
                  title: errMessage.toString(),
                  status: 'warning',
                });
              }
          });
      };
    
  
    useEffect(() => {
      setTabName('Lấy lại mật khẩu');
    }, []);
  
    return (
      <Box bg="white" w="30em" p="1em" textAlign="left" borderRadius="md">
        <Text fontSize="2xl" fontWeight="800">
          Quên mật khẩu
        </Text>
        <Text fontSize="sm">
            Vui lòng nhập Email bạn đã đăng ký để khôi phục lại mật khẩu
        </ Text>
  
        <form onSubmit={handleSubmit(handleResetPassword)}>
        <Box pos="relative" pb="1em">
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
  
          <Button
            width="80px"
            bg="blue.700"
            color="white"
            my="0.5em"
            _hover={{ bg: 'blue.600' }}
            type="submit"
          >
            Gửi
          </Button>
        </form>

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
  