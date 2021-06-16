import { Box, Text, Image, VStack, HStack, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import http from 'utils/http';

import UserInfoLayout from '../user-info/UserInfoLayout';
import UserInfoMenu from '../user-info/UserInfoMenu';
import imagePath from 'utils/imagePath';
import timeToDate from 'utils/timeToDate';
import ImageGrid from 'components/common/ImageGrid';
import convertToHTML from 'utils/convertToHTML';

const PendingPost = () => {
  const [loading, setLoading] = useState(true);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    http
      .get('/posts/pending')
      .then(res => {
        setPendingPosts(res.data);
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
              Bài viết chờ duyệt
            </Text>
            <Text m="0.5em 0 2em 0">{pendingPosts.length} Bài viết</Text>
            <Box>
              <Box>
                {!pendingPosts.length ? (
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
                  pendingPosts.slice(0, page * perPage).map(post => (
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
                    </VStack>
                  ))
                )}
              </Box>
            </Box>
            {page * perPage < pendingPosts.length && (
              <HStack justify="center">
                <Button
                  colorScheme="blue"
                  fontWeight="600"
                  p="0.5em"
                  cursor="pointer"
                  onClick={() =>
                    page * perPage < pendingPosts.length &&
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

export default PendingPost;
