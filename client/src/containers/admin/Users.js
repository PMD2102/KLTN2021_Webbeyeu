import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import MyModal from 'components/common/MyModal';
import React, { useEffect, useState } from 'react';
import http from 'utils/http';
import { removeAndAdd, removeOfArrayByIdx } from 'utils';
import ToastNotify from 'components/common/ToastNotify';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isShowViewDetailModal, setIsShowDetailModal] = useState(false);
  const [isShowViewDeletelModal, setIsShowDeletelModal] = useState(false);
  const [userSelected, setUserSelected] = useState();

  useEffect(() => {
    http
      .get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleLockOrUnlockUser = (userId, isActivate) => {
    http
      .post(`/users/${userId}/lock-or-unlock`, { isActivate })
      .then(res => {
        let index;
        const user = users.find((user, idx) => {
          if (user._id === userId) {
            index = idx;
            return true;
          }
          return false;
        });
        user.isActivate = !user.isActivate;
        setUsers(removeAndAdd(users, user, index));
      })
      .catch(err => console.error(err));
  };

  const handleDeleteUser = userId => {
    http
      .delete(`/users/${userId}`)
      .then(res => {
        const idx = users.findIndex(user => user._id === userId);
        setUsers(removeOfArrayByIdx(users, idx));
        ToastNotify({
          title: 'Xóa người dùng thành công',
          status: 'success',
        });
        setIsShowDeletelModal(false);
      })
      .catch(err => console.error(err));
  };

  const handleAddTagDoctor = async userId => {
    http
      .put(`/users/${userId}`, { tag: 'Bác sĩ' })
      .then(res => {
        setUserSelected(res.data);
        const idx = users.findIndex(u => u._id === res.data._id);
        setUsers(removeAndAdd(users, res.data, idx));
      })
      .catch(err => console.log(err));
  };

  const handleRemoveTagDoctor = async userId => {
    http
      .put(`/users/${userId}`, { tag: '' })
      .then(res => {
        setUserSelected(res.data);
        const idx = users.findIndex(u => u._id === res.data._id);
        setUsers(removeAndAdd(users, res.data, idx));
      })
      .catch(err => console.log(err));
  };

  return (
    <Box>
      <MyModal
        isOpenModal={isShowViewDetailModal}
        setCloseModal={setIsShowDetailModal}
        title="Thông tin người dùng số điện thoại"
        size="4xl"
      >
        <HStack align="flex-start">
          <Box flex="1">
            <Table variant="simple" borderColor="gray.200">
              <Tbody>
                <Tr>
                  <Td>
                    <Text fontWeight="bold">ID</Text>
                  </Td>
                  <Td>
                    <Text>{userSelected?._id}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontWeight="bold">Tên</Text>
                  </Td>
                  <Td>
                    <Text>{userSelected?.name}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontWeight="bold">Username</Text>
                  </Td>
                  <Td>
                    <Text>{userSelected?.username}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontWeight="bold">Email</Text>
                  </Td>
                  <Td>
                    <Text>{userSelected?.email}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontWeight="bold">Số điện thoại</Text>
                  </Td>
                  <Td>
                    <Text>{userSelected?.phone ?? 'N/A'}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text fontWeight="bold">Giới tính</Text>
                  </Td>
                  <Td>
                    {userSelected?.gender ?  
                      <Text>
                        {userSelected.gender === 1
                        ? 'Nam'
                        : userSelected.gender === 2
                        ? 'Nữ'
                        : 'Khác'}
                      </Text>
                      : 'Khác'
                    }
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            {/* <HStack justify="space-between">
              <Text>Name:</Text>
              <Text>{userSelected?.name}</Text>
            </HStack> */}
          </Box>
          <VStack ml="auto">
            <Avatar
              boxSize="12em"
              objectFit="cover"
              name={userSelected?.username}
              src={
                userSelected?.avatar ??
                'data:image/jpeg;base64,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'
              }
              alt="image"
            />
            {!userSelected?.tag ? (
              <Button
                colorScheme="blue"
                onClick={() => handleAddTagDoctor(userSelected?._id)}
              >
                Gán tag bác sĩ
              </Button>
            ) : (
              <Text
                fontWeight="bold"
                fontSize="lg"
                color="red.400"
                bg="gray.200"
                p="0.5em"
                borderRadius="md"
                cursor="pointer"
                onClick={() => handleRemoveTagDoctor(userSelected?._id)}
              >
                Bác sĩ
              </Text>
            )}
          </VStack>
        </HStack>
      </MyModal>
      <MyModal
        isOpenModal={isShowViewDeletelModal}
        setCloseModal={setIsShowDeletelModal}
        title="Xác nhận"
        isCentered={false}
      >
        <Text>Bạn có muốn xóa người dùng này không?</Text>
         <HStack justify="flex-end" mt="1em">
          <Button
            colorScheme="gray"
            onClick={() => setIsShowDeletelModal(false)}
          >
            Hủy
          </Button>
          <Button
          bg="red.400"
          _hover={{ bg: 'red.200' }}
          onClick={() => {
            handleDeleteUser(userSelected?._id);
          }}
          >
          Xóa
          </Button>
        </HStack>
      </MyModal>

      <Divider my="0.5em" size="lg" colorScheme="blue" />

      <Table variant="simple" borderColor="gray.200">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Tên</Th>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Tag</Th>
            <Th>Chi tiết</Th>
            <Th isNumeric></Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, idx) => (
            <Tr key={user._id}>
              <Td>{idx + 1}</Td>
              <Td>{user.name}</Td>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>
                {user.tag && (
                  <Text
                    d="inline-block"
                    fontWeight="bold"
                    fontSize="lg"
                    color="red.400"
                    bg="gray.100"
                    p="0.5em"
                    borderRadius="md"
                  >
                    {user.tag}
                  </Text>
                )}
              </Td>
              <Td>
                <Button
                  bg="blue.400"
                  as="i"
                  cursor="pointer"
                  color="white"
                  _hover={{ bg: 'blue.200' }}
                  onClick={() => {
                    setUserSelected(user);
                    setIsShowDetailModal(true);
                  }}
                >
                  Xem
                </Button>
              </Td>
              <Td color="white" isNumeric>
                <HStack justify="flex-end">
                  <Button
                    bg="gray.600"
                    _hover={{ bg: 'gray.400' }}
                    onClick={() =>
                      handleLockOrUnlockUser(user._id, user.isActivate)
                    }
                  >
                    {user.isActivate ? 'Khóa' : 'Mở khóa'}
                  </Button>
                  <Button
                    bg="red.400"
                    _hover={{ bg: 'red.200' }}
                    onClick={() => { 
                      setUserSelected(user);
                      setIsShowDeletelModal(true);
                    }}
                  >
                    Xóa
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Users;
