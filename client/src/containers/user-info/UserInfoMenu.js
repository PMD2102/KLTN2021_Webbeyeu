import {
  Box,
  Text,
  VStack,
  Avatar,
  Divider,
  HStack,
  Image,
  Flex,
  Button,
  Input,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { GlobalContext } from 'context/GlobalContext';
import MyModal from 'components/common/MyModal';
import http from 'utils/http';
import ToastNotify from 'components/common/ToastNotify';
import imagePath from 'utils/imagePath';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UserInfoMenu = () => {
  const { user } = useContext(GlobalContext);
  const [isShowChangePasswordModal, setIsShowChangePasswordModal] =
    useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [typePass, setTypePass] = useState(false);
  const [typeNewPass, setTypeNewPass] = useState(false);
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleChangePassword = () => {
    if (!Object.keys(errors).length) {
      if (newPassword === currentPassword) return;
    http
      .post('/users/change-password', { currentPassword, newPassword })
      .then(res => {
        ToastNotify({
          title: 'Đổi mật khẩu thành công',
          status: 'success',
        });
        resetState();
        setCurrentPassword('');
        setNewPassword('');
        setIsShowChangePasswordModal(false);
      })
      .catch(err => {
        if (err.response?.data) {
          console.error(err.response?.data);
          ToastNotify({
            title: err.response.data,
            status: 'warning',
          });
        }
      });
    }
  };

  const resetState = () => {
    if (currentPassword) setCurrentPassword('');
    if (newPassword) setNewPassword('');
  };

  return (
    <Box w="30%" bg="white" borderRadius="md" p="1em" textAlign="left">
      <MyModal
        isOpenModal={isShowChangePasswordModal}
        setCloseModal={setIsShowChangePasswordModal}
        title="Đổi mật khẩu"
        isCentered={false}
      >
        <form onSubmit={handleSubmit(handleChangePassword)}>
          <Box pos="relative" pb="1em">
            <Input
              id="password"
              {...register('password', { 
                required: true, 
                maxLength: 20, 
                minLength: 8, 
              })}
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              type={ typePass ? "text" : "password" }
              placeholder="Mật khẩu hiện tại"
            />
            {errors.password && (
              <Text
                pos="absolute"
                left="0"
                bottom="0"
                as="i"
                fontSize="11px"
                color="red.600"
              >
                {errors.password?.type === 'required'
                ? 'Mật khẩu là bắt buộc'
                : errors.password?.type === 'maxLength'
                ? 'Mật khẩu tối đa 20 ký tự'
                : errors.password?.type === 'minLength'
                ? 'Mật khẩu tối thiểu 8 ký tự'
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
                  fontSize: "20px"
                }} 
                  onClick={() => setTypePass(!typePass)}
                >
                  {typePass ? <FaEyeSlash />: <FaEye />}
              </small>
            </ Box>
            <Box pos="relative" pb="1em">
            <Input
              id="newpassword"
              {...register('newpassword', { 
                required: true, 
                maxLength: 20, 
                minLength: 8, 
                pattern: /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/ 
              })}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              type={ typeNewPass ? "text" : "password" }
              placeholder="Mật khẩu mới"
            />
            {(errors.newpassword || newPassword) && (
              <Text
                pos="absolute"
                left="0"
                bottom="0"
                as="i"
                fontSize="11px"
                color="red.600"
              >
                {errors.newpassword?.type === 'required'
                ? 'Mật khẩu là bắt buộc'
                : errors.newpassword?.type === 'maxLength'
                ? 'Mật khẩu tối đa 20 ký tự'
                : errors.newpassword?.type === 'minLength'
                ? 'Mật khẩu tối thiểu 8 ký tự'
                : errors.newpassword?.type === 'pattern'
                ? "Mật khẩu chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt"
                : newPassword === currentPassword
                ? 'Mật khẩu mới không được trùng với mật khẩu cũ'
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
                  fontSize: "20px"
                }} 
                  onClick={() => setTypeNewPass(!typeNewPass)}
                >
                  {typeNewPass ? <FaEyeSlash />: <FaEye />}
              </small>
            </ Box>
        
        <HStack justify="flex-end" mt="0.5em">
          <Button
            colorScheme="gray"
            onClick={() => setIsShowChangePasswordModal(false)}
          >
            Hủy
          </Button>
          <Button colorScheme="blue" type="submit">
            Lưu
          </Button>
        </HStack>
        </ form>
      </MyModal>

      <VStack align="center">
        <Avatar size="2xl" name={user.username} src={imagePath(user.avatar)} />
        <Text>{user.username}</Text>
        {user?.tag && (
          <Text
            fontWeight="bold"
            fontSize="lg"
            color="red.400"
            bg="gray.200"
            p="0.5em"
            borderRadius="md"
          >
            {user.tag}
          </Text>
        )}
      </VStack>

      <Divider my="1em" />

      <Link to={`/${user.username}/ho-so`}>
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/info.png"
          />
          <Text fontWeight="600">Thông tin cá nhân</Text>
        </HStack>
      </Link>
      <Link to="/tin-nhan">
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/message.png"
          />
          <Text fontWeight="600">Tin nhắn</Text>
        </HStack>
      </Link>
      <Link to="bai-viet">
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/user-post.png"
          />
          <Text fontWeight="600">Bài viết</Text>
        </HStack>
      </Link>
      <Link to="/bai-viet-cho-duyet">
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/icon_check_approve.png"
          />
          <Text fontWeight="600">Bài viết chờ duyệt</Text>
        </HStack>
      </Link>
      <Link to="/bai-viet-da-luu">
        {' '}
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/bookmark.png"
          />
          <Text fontWeight="600">Bài viết đã lưu</Text>
        </HStack>
      </Link>
      {/* <Link to="cong-dong-tham-gia">
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/user-community.png"
          />
          <Text fontWeight="600">Cộng đồng đã tham gia</Text>
        </HStack>
      </Link> */}
      <Link to="/binh-luan">
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/user-comment.png"
          />
          <Text fontWeight="600">Bình luận</Text>
        </HStack>
      </Link>
      <Link to="/binh-luan-cho-duyet">
        {' '}
        <HStack
          cursor="pointer"
          p="0.5em"
          borderRadius="md"
          _hover={{ bg: 'gray.200' }}
        >
          <Image
            boxSize="2em"
            objectFit="cover"
            borderRadius="md"
            src="https://www.webtretho.com/static/img/cmt_pending.png"
          />
          <Text fontWeight="600">Bình luận chờ duyệt</Text>
        </HStack>
      </Link>

      <Divider my="1em" />

      <Flex align="center" justify="center">
        <Button
          bg="blue.700"
          color="white"
          fontWeight="600"
          _hover={{ bg: 'blue.600' }}
          onClick={() => setIsShowChangePasswordModal(true)}
        >
          Đổi mật khẩu
        </Button>
      </Flex>
    </Box>
  );
};

export default UserInfoMenu;
