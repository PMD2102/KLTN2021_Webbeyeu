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
import ImageGrid from 'components/common/ImageGrid';
import convertToHTML from 'utils/convertToHTML';
import { BiLike } from 'react-icons/bi';
import { FaFlag, FaRegComment } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const SavedPost = () => {
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    http
      .get('/posts/saved')
      .then(res => {
        setSavedPosts(res.data);
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
              Bài viết đã lưu
            </Text>
            <Text m="0.5em 0 2em 0">{savedPosts.length} Bài viết</Text>
            <Box>
              <Box>
                {!savedPosts.length ? (
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
                  savedPosts.slice(0, page * perPage).map(post => (
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
                          <HStack fontSize="md">
                          <Text>Đăng bởi</Text>
                          <Text
                            fontWeight="600"
                            color="blue.700"
                          >
                            {post.author?.username}
                          </Text>
                            {post.author?.tag && (
                            <Text
                              fontWeight="bold"
                              fontSize="lg"
                              color="red.400"
                              bg="gray.200"
                              p="0.5em"
                              borderRadius="md"
                            >
                              Bác sĩ
                            </Text>
                          )}
                          <Text as="sup">.</Text>
                          <Text>{timeToDate(post.createdAt)}</Text>
                        </HStack>
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
                      {/* <HStack
                        borderTop="1px solid"
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        justify="space-between"
                      >
                        <HStack spacing="16">
                          <HStack>
                            <Box
                              p="0.5em"
                              // onClick={() => handleLikeOrUnlike(post._id)}
                            >
                              <Icon
                                w="2em"
                                h="2em"
                                cursor="pointer"
                                _hover={{ color: 'blue.700' }}
                                as={BiLike}
                              />
                            </Box>
                            <Text>{post.totalLike}</Text>
                          </HStack>
                          <HStack>
                            <Box p="0.5em">
                              <Icon
                                w="2em"
                                h="2em"
                                cursor="pointer"
                                _hover={{ color: 'blue.700' }}
                                as={FaRegComment}
                              />
                            </Box>
                            <Text>{post.totalComment}</Text>
                          </HStack>
                          <Box p="0.5em">
                            <Icon
                              w="2em"
                              h="2em"
                              cursor="pointer"
                              _hover={{ color: 'blue.700' }}
                              as={FaFlag}
                              // onClick={() => handleReport(REPORT_TYPE.POST, post._id)}
                            />
                          </Box>
                        </HStack>

                        <Box p="0.5em">
                          <Icon
                            w="2em"
                            h="2em"
                            cursor="pointer"
                            _hover={{ color: 'blue.700' }}
                            as={FiShare}
                            // onClick={() => handleSavePost(post._id)}
                          />
                        </Box>
                      </HStack> */}
                    </VStack>
                  ))
                )}
              </Box>
            </Box>
            {page * perPage < savedPosts.length && (
              <HStack justify="center">
                <Button
                  colorScheme="blue"
                  fontWeight="600"
                  p="0.5em"
                  cursor="pointer"
                  onClick={() =>
                    page * perPage < savedPosts.length &&
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

export default SavedPost;
