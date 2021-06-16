import {
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Icon,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import http from 'utils/http';

import UserInfoLayout from '../user-info/UserInfoLayout';
import UserInfoMenu from '../user-info/UserInfoMenu';
import imagePath from 'utils/imagePath';
import timeToDate from 'utils/timeToDate';
import { POST_STATUS } from 'constants/keys';

const PendingComment = () => {
  const [loading, setLoading] = useState(true);
  const [pendingComments, setPendingComments] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    http
      .post('/posts/comments', { type: POST_STATUS.PENDING })
      .then(res => {
        console.log(res.data);
        setPendingComments(res.data);
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
              Bình luận chờ duyệt
            </Text>
            <Text m="0.5em 0 2em 0">{pendingComments.length} bình luận</Text>
            <Box>
              <Box>
                {!pendingComments.length ? (
                  <HStack>
                    <Image
                      boxSize="3em"
                      objectFit="cover"
                      src="https://www.webtretho.com/static/img/icon_check_approve.png"
                      alt="image"
                    />
                    <Text>Không có bình luận chờ duyệt!</Text>
                  </HStack>
                ) : (
                  pendingComments.slice(0, page * perPage).map(comment => (
                    <VStack
                      // key={post._id}
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
                          src={imagePath(comment.post?.images[0])}
                          alt="image"
                        />
                        <VStack align="flex-start">
                          <Text as="i" fontWeight="bold">
                            {comment.post?.title}
                          </Text>
                          <Text as="i" fontSize="xs">
                            {timeToDate(comment.createdAt)}
                          </Text>
                        </VStack>
                      </HStack>
                      <Text>{comment.content}</Text>
                    </VStack>
                  ))
                )}
              </Box>
            </Box>
            {page * perPage < pendingComments.length && (
              <HStack justify="center">
                <Button
                  colorScheme="blue"
                  fontWeight="600"
                  p="0.5em"
                  cursor="pointer"
                  onClick={() =>
                    page * perPage < pendingComments.length &&
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

export default PendingComment;
