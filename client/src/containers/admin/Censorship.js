import {
  Box,
  Button,
  Divider,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import MyModal from 'components/common/MyModal';
import ToastNotify from 'components/common/ToastNotify';
import React, { useEffect, useState } from 'react';
import { removeAndAdd, removeOfArrayByIdx } from 'utils';
import http from 'utils/http';

const menu = {
  all: -1,
  pending: 0,
  approve: 1,
  reject: 2,
};

const Censorship = () => {
  const [activeTab, setActiveTab] = useState(menu.all);
  const [comments, setComments] = useState([]);
  const [isShowViewDeletelModal,setIsShowDeletelModal] = useState(false);
  const [commentSelected, setCommentSelected] = useState();
  const [isShowViewDetailModal, setIsShowDetailModal] = useState(false);
  // const [postSelected, setPostSelected] = useState();

  useEffect(() => {
    http
      .get('/posts/comments')
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChangeTab = tab => {
    if (tab !== activeTab) setActiveTab(tab);
  };

  const handleApproveOrReject = (commentId, isApprove) => {
    http
      .put(`/posts/comments/${commentId}`, {
        status: isApprove ? menu.approve : menu.reject,
      })
      .then(res => {
        const idx = comments.findIndex(comment => comment._id === commentId);
        setComments(removeAndAdd(comments, res.data, idx));
      })
      .catch(err => console.error(err));
  };

  const handleDelete = commentId => {
    http
      .delete(`/posts/comments/${commentId}`)
      .then(res => {
        const idx = comments.findIndex(comment => comment._id === commentId);
        setComments(removeOfArrayByIdx(comments, idx));
        ToastNotify({
          title: 'Xóa bình luận thành công',
          status: 'success',
        });
        setIsShowDeletelModal(false);
      })
      .catch(err => console.error(err));
  };

  return (
    <Box>
      <MyModal
        isOpenModal={isShowViewDeletelModal}
        setCloseModal={setIsShowDeletelModal}
        title="Xác nhận"
        isCentered={false}
      >
        <Text>Bạn có muốn xóa bình luận này không?</Text>
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
            handleDelete(commentSelected?._id);
          }}
          >
          Xóa
          </Button>
        </HStack>
      </MyModal>

      <HStack spacing="8">
        <Text
          p="0.5em 2em"
          fontWeight="bold"
          cursor="pointer"
          bg={activeTab === menu.all ? 'teal' : ''}
          color={activeTab === menu.all ? 'white' : ''}
          borderRadius="md"
          border="1px solid"
          _hover={{ bg: activeTab === menu.all ? '' : 'gray.300' }}
          onClick={() => handleChangeTab(menu.all)}
        >
          Tất cả
        </Text>
        <Text
          p="0.5em 2em"
          fontWeight="bold"
          cursor="pointer"
          bg={activeTab === menu.approve ? 'teal' : ''}
          color={activeTab === menu.approve ? 'white' : ''}
          borderRadius="md"
          border="1px solid"
          _hover={{ bg: activeTab === menu.approve ? '' : 'gray.300' }}
          onClick={() => handleChangeTab(menu.approve)}
        >
          Đã duyệt
        </Text>
        <Text
          p="0.5em 2em"
          fontWeight="bold"
          cursor="pointer"
          bg={activeTab === menu.pending ? 'teal' : ''}
          color={activeTab === menu.pending ? 'white' : ''}
          borderRadius="md"
          border="1px solid"
          _hover={{ bg: activeTab === menu.pending ? '' : 'gray.300' }}
          onClick={() => handleChangeTab(menu.pending)}
        >
          Chờ duyệt
        </Text>
        <Text
          p="0.5em 2em"
          fontWeight="bold"
          cursor="pointer"
          bg={activeTab === menu.reject ? 'teal' : ''}
          color={activeTab === menu.reject ? 'white' : ''}
          borderRadius="md"
          border="1px solid"
          _hover={{ bg: activeTab === menu.reject ? '' : 'gray.300' }}
          onClick={() => handleChangeTab(menu.reject)}
        >
          Bị từ chối
        </Text>
      </HStack>

      <Divider my="0.5em" size="lg" colorScheme="blue" />

      <Table variant="simple" borderColor="gray.200">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Username</Th>
            <Th>Bài viết </Th>
            <Th>Nội dung</Th>
            {/* <Th>Detail</Th> */}
            <Th></Th>
          </Tr>
        </Thead>

        <Tbody>
          {comments
            .filter(comment =>
              activeTab === menu.all ? true : comment.status === activeTab
            )
            .map((comment, idx) => (
              <Tr>
                <Td>{idx + 1}</Td>
                <Td>{comment.author?.username}</Td>
                <Td>{comment.post?.title}</Td>
                <Td>{comment.content}</Td>
                {/* <Td>
                  <Button
                    bg="blue.400"
                    as="i"
                    cursor="pointer"
                    color="white"
                    _hover={{ bg: 'blue.200' }}
                    // onClick={() => {
                    //   setPostSelected(post);
                    //   setIsShowDetailModal(true);
                    // }}
                  >
                    View
                  </Button>
                </Td> */}
                <Td color="white" isNumeric>
                  <HStack justify="flex-end">
                    <>
                      {comment.status !== menu.approve && (
                        <Button
                          bg="teal.400"
                          _hover={{ bg: 'teal.200' }}
                          onClick={() =>
                            handleApproveOrReject(comment._id, true)
                          }
                        >
                          Duyệt
                        </Button>
                      )}
                      {comment.status !== menu.reject && (
                        <Button
                          bg="gray.600"
                          _hover={{ bg: 'gray.400' }}
                          onClick={() =>
                            handleApproveOrReject(comment._id, false)
                          }
                        >
                          Từ chối
                        </Button>
                      )}
                    </>
                    <Button
                      bg="red.400"
                      _hover={{ bg: 'red.200' }}
                      onClick={() => {
                        setCommentSelected(comment);
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

export default Censorship;
