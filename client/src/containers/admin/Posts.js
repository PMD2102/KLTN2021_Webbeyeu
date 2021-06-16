import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import ImageGrid from 'components/common/ImageGrid';
import MyModal from 'components/common/MyModal';
import ToastNotify from 'components/common/ToastNotify';
import React, { useEffect, useState } from 'react';
import { FaRegComment } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';
import { removeAndAdd, removeOfArrayByIdx, timeSince } from 'utils';
import convertToHTML from 'utils/convertToHTML';
import http from 'utils/http';
import imagePath from 'utils/imagePath';

const menu = {
  all: -1,
  pending: 0,
  approve: 1,
  reject: 2,
};

const Posts = () => {
  const [activeTab, setActiveTab] = useState(menu.all);
  const [posts, setPosts] = useState([]);
  const [isShowViewDetailModal, setIsShowDetailModal] = useState(false);
  const [postSelected, setPostSelected] = useState();
  const [isShowViewDeletelModal,setIsShowDeletelModal] = useState(false);
  const [viewFull, setViewFull] = useState(false);

  useEffect(() => {
    http
      .get('/posts/all')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChangeTab = tab => {
    if (tab !== activeTab) setActiveTab(tab);
  };

  const handleApproveOrRejectPost = (postId, isApprove) => {
    http
      .put(`/posts/${postId}`, {
        status: isApprove ? menu.approve : menu.reject,
      })
      .then(res => {
        const idx = posts.findIndex(post => post._id === postId);
        setPosts(removeAndAdd(posts, res.data, idx));
      })
      .catch(err => console.error(err));
  };

  const handleDeletePost = postId => {
    http
      .delete(`/posts/${postId}`)
      .then(res => {
        const idx = posts.findIndex(post => post._id === postId);
        setPosts(removeOfArrayByIdx(posts, idx));
        ToastNotify({
          title: 'Xóa bài viết thành công',
          status: 'success',
        });
        setIsShowDeletelModal(false);
      })
      .catch(err => console.error(err));
  };

  return (
    <Box>
      <MyModal
        isOpenModal={isShowViewDetailModal}
        setCloseModal={setIsShowDetailModal}
        scrollBehavior="inside"
        size="4xl"
      >
        {/* header */}
        {/* <HStack justify="space-between"> */}
        {postSelected && (
          <>
            <HStack>
              <Image
                borderRadius="md"
                boxSize="3em"
                objectFit="cover"
                src={imagePath(postSelected?.community?.avatar)}
              />

              <Box textAlign="left">
                <Text fontWeight="600" color="blue.700">
                  {postSelected?.title}
                </Text>
                <HStack fontSize="md">
                  <Text>Đăng bởi:</Text>
                  <Text fontWeight="600" color="blue.700">
                    {postSelected?.author?.username}
                  </Text>
                  <Text as="sup">.</Text>
                  <Text>{timeSince(postSelected?.createdAt)}</Text>
                </HStack>
              </Box>
            </HStack>

            {/* </HStack> */}

            {/* content */}
            <Box textAlign="left">
              <Text fontWeight="600" fontSize="xl" color="black" mt="0.5em">
                {postSelected?.title}
              </Text>
              <Text
                fontSize="md"
                className={viewFull ? '': "three-line-text"}
                my="1em"
                dangerouslySetInnerHTML={convertToHTML(postSelected?.content)}
              ></Text>
              <Text 
                color="blue"
                onClick={() => setViewFull(!viewFull)}
              >
                Xem thêm
              </Text>
              <ImageGrid
                images={postSelected?.images?.map(img => imagePath(img))}
              />
            </Box>
          </>
        )}
      </MyModal>
      <MyModal
        isOpenModal={isShowViewDeletelModal}
        setCloseModal={setIsShowDeletelModal}
        title="Xác nhận"
        isCentered={false}
      >
        <Text>Bạn có muốn xóa bài viết này không?</Text>
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
            handleDeletePost(postSelected?._id);
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
            <Th>Tác giả</Th>
            <Th>Cộng đồng</Th>
            <Th>Tiêu đề</Th>
            <Th>Chi tiết</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {posts
            .filter(post =>
              activeTab === menu.all ? true : post.status === activeTab
            )
            .map((post, idx) => (
              <Tr key={post._id}>
                <Td>{idx + 1}</Td>
                <Td>{post.author?.username}</Td>
                <Td>{post.community?.name}</Td>
                <Td>{post.title}</Td>
                <Td>
                  <Button
                    bg="blue.400"
                    as="i"
                    cursor="pointer"
                    color="white"
                    _hover={{ bg: 'blue.200' }}
                    onClick={() => {
                      setPostSelected(post);
                      setIsShowDetailModal(true);
                    }}
                  >
                    Xem
                  </Button>
                </Td>
                <Td color="white" isNumeric>
                  <HStack justify="flex-end">
                    <>
                      {post.status !== menu.approve && (
                        <Button
                          bg="teal.400"
                          _hover={{ bg: 'teal.200' }}
                          onClick={() =>
                            handleApproveOrRejectPost(post._id, true)
                          }
                        >
                          Duyệt
                        </Button>
                      )}
                      {post.status !== menu.reject && (
                        <Button
                          bg="gray.600"
                          _hover={{ bg: 'gray.400' }}
                          onClick={() =>
                            handleApproveOrRejectPost(post._id, false)
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
                        setPostSelected(post);
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

export default Posts;
