import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Input,
  Table, Tbody,
  Td,
  Text,
  Textarea, Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import LoadingPage from 'components/common/LoadingPage';
import MyModal from 'components/common/MyModal';
import ToastNotify from 'components/common/ToastNotify';
import { GlobalContext } from 'context/GlobalContext';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import http from 'utils/http';
import imagePath from 'utils/imagePath';
import uploadFile from 'utils/uploadFile';

const Community = () => {
  const { communities, addCommunity } = useContext(GlobalContext);

  const [isShowModal, setIsShowModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleUploadImage = () => {
    uploadFile(fileSelected)
      .then(res => console.log(res))
      .catch(err => console.error(err));
  };

  const handleCreateCommunity = async (data) => {
    if (!Object.keys(errors).length) {
    setLoading(true);

    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('image', fileSelected);
    formData.append('introduce', data.introduce);
    
    http
      .post('/community', formData)
      .then(res => {
        ToastNotify({
          title: 'Tạo cộng đồng thành công',
          status: 'success',
        });
        addCommunity(res.data);
        setIsShowModal(false);
        setLoading(false);
        formData.append('name', '');
        formData.append('image', '');
        formData.append('introduce', '');
      })
      .catch(err => {
          let errMessage = err.response?.data;
          if (errMessage) {
            ToastNotify({
              title: errMessage.msg.toString(),
              status: 'warning',
            });
          }
        setLoading(false);
      });
    }
  };

  return (
    <Box>
      {/* <input type="file" onChange={e => setFileSelected(e.target.files[0])} />
      <Button onClick={() => handleUploadImage()}>Upload</Button> */}
      {loading && <LoadingPage />}
     
      <MyModal
        isOpenModal={isShowModal}
        setCloseModal={setIsShowModal}
        title="Tạo cộng đồng mới"
        isCentered={false}
      >
      <form onSubmit={handleSubmit(handleCreateCommunity)}>
      <Box pos="relative" pb="0.5em">
        <Input
          id="name"
          {...register('name', { required: true, maxLength: 50, minLength: 9 })}
          // name={name}
          // onChange={e => setName(e.target.value)}
          mb="1em"
          placeholder="Tên cộng đồng"
        />
          {errors.name && (
            <Text
              pos="absolute"
              left="0"
              bottom="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.name?.type === 'required'
                ? 'Tên cộng đồng là bắt buộc'
                : errors.name?.type === 'maxLength'
                ? 'Tên tối đa 50 ký tự'
                : errors.name?.type === 'minLength'
                ? 'Tên tối thiểu 9 ký tự'
                : ''}
            </Text>
          )}
        </ Box>
        <Box pos="relative" pb="0.5em">
          <Text>Ảnh dại diện</Text>
          <input
            id="image"
            type="file"
            {...register('image', { required: true})}
            onChange={e => setFileSelected(e.target.files[0])}
          />
          {errors.image && (
            <Text
              pos="absolute"
              marginTop="7"
              left="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.image?.type === 'required'
                ? 'Avatar cộng đồng là bắt buộc'
                : ''}
            </Text>
          )}
        </Box>
        <Box pos="relative" pb="0.5em">
        <Textarea
          id="introduce"
          {...register('introduce', { required: true, maxLength: 500, minLength: 30 })}
          my="1em"
          placeholder="Giới thiệu về cộng đồng"
          // name={introduce}
          // onChange={e => setIntroduce(e.target.value)}
        />
         {errors.introduce && (
            <Text
              pos="absolute"
              left="0"
              bottom="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.introduce?.type === 'required'
                ? 'Phần giới thiệu là bắt buộc'
                : errors.introduce?.type === 'maxLength'
                ? 'Phần giới thiệu tối đa 500 ký tự'
                : errors.introduce?.type === 'minLength'
                ? 'Phần giới thiệu tối thiểu 30 ký tự'
                : ''}
            </Text>
          )}
        </ Box>
        <HStack justify="flex-end">
          <Button colorScheme="teal" type="submit">
            Tạo mới
          </Button>
        </HStack>
        </ form>
      </MyModal>
    
      <Button colorScheme="teal" onClick={() => setIsShowModal(true)}>
        Tạo mới
      </Button>
     
      <Divider my="0.5em" size="lg" colorScheme="blue" />

      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Tên</Th>
            <Th>Ảnh đại diện</Th>
            <Th>Giới thiệu</Th>
            <Th>Số thành viên</Th>
            <Th>Số bài viết</Th>
            {/* <Th isNumeric></Th> */}
          </Tr>
        </Thead>
        <Tbody>
          {communities.map((community, idx) => (
            <Tr>
              <Td>{idx + 1}</Td>
              <Td>{community.name}</Td>
              <Td>
                <Avatar
                  boxSize="5em"
                  name={community.name}
                  src={imagePath(community.avatar)}
                />
              </Td>
              <Td>{community.introduce}</Td>
              <Td>{community.totalMember}</Td>
              <Td>{community.totalPost}</Td>
              {/* <Td isNumeric>
                <Button bg="red.400" _hover={{ bg: 'red.200' }} color="white">
                  Delete
                </Button>
              </Td> */}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Community;
