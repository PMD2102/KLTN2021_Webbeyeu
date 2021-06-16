import {
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Icon,
  Button,
} from '@chakra-ui/react';
import React, { useEffect, useState, useContext } from 'react';
import http from 'utils/http';

import UserInfoLayout from '../user-info/UserInfoLayout';
import UserInfoMenu from '../user-info/UserInfoMenu';
import imagePath from 'utils/imagePath';
import timeToDate from 'utils/timeToDate';
import ImageGrid from 'components/common/ImageGrid';
import convertToHTML from 'utils/convertToHTML';
import { FaFlag, FaRegComment } from 'react-icons/fa';
import { BiLike } from 'react-icons/bi';
import { FiShare } from 'react-icons/fi';
import { GlobalContext } from 'context/GlobalContext';
import { Link } from 'react-router-dom';

const ApprovePost = () => {
  const { user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [approvePosts, setApprovePosts] = useState([]);

  useEffect(() => {
    http
      .get('/posts/approve')
      .then(res => {
        setApprovePosts(res.data.filter(post => post.author._id === user._id));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <UserInfoLayout>
      <Box flex="1" textAlign="left">
        {!loading ? (
          <>
            <Text fontSize="2xl" fontWeight="bold">
              Bài viết
            </Text>
            <Text m="0.5em 0 2em 0">{approvePosts.length} Bài viết</Text>
            <Box>
              <Box>
                {!approvePosts.length ? (
                  <HStack>
                    <Image
                      boxSize="3em"
                      objectFit="cover"
                      src="https://www.webtretho.com/static/img/icon_check_approve.png"
                      alt="image"
                    />
                    <Text>Không có bài viết chờ duyệt!</Text>
                  </HStack>
                ) : (
                  approvePosts.slice(0, page * perPage).map(post => (
                    <VStack
                      key={post._id}
                      p="0.5em 1em"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      bg="white"
                      borderRadius="md"
                      my="1em"
                      align="flex-start"
                    >
                      {/* <Box>{post.author?.name}</Box> */}
                      <HStack align="flex-start">
                        <Image
                          boxSize="3em"
                          objectFit="cover"
                          src={imagePath(post.community?.avatar)}
                          alt="image"
                        />
                        <VStack align="flex-start">
                          <Text as="i" fontWeight="bold">
                            {post.community?.name}
                          </Text>
                          <Text as="i" fontSize="xs">
                            {timeToDate(post.createdAt)}
                          </Text>
                        </VStack>
                      </HStack>
                      <Link to={`/bai-viet/${post._id}`}>
                      <Text fontWeight="600" fontSize="xl" color="black" mt="0.5em">
                        {post.title}
                      </Text>
                      <Text
                        fontSize="md"
                        className="three-line-text"
                        my="1em"
                        className="three-line-text"
                        dangerouslySetInnerHTML={convertToHTML(post.content)}
                      ></Text>
                      <ImageGrid
                        images={post.images?.map(img => imagePath(img))}
                      />
                        </ Link>
                    </VStack>
                  ))
                )}
              </Box>
            </Box>
            {page * perPage < approvePosts.length && (
              <HStack justify="center">
                <Button
                  colorScheme="blue"
                  fontWeight="600"
                  p="0.5em"
                  cursor="pointer"
                  onClick={() =>
                    page * perPage < approvePosts.length &&
                    setPage(preState => ++preState)
                  }
                >
                  Xem thêm
                </Button>
              </HStack>
            )}
          </>
        ) : (
          <Box>Loading</Box>
        )}
      </Box>
      <UserInfoMenu></UserInfoMenu>
    </UserInfoLayout>
  );
};

export default ApprovePost;
