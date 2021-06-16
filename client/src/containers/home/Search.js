import { Box, HStack, Text } from '@chakra-ui/layout';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, Link, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import http from 'utils/http';
import { Avatar } from '@chakra-ui/avatar';
import { timeSince } from 'utils';
import imagePath from 'utils/imagePath';
import convertToHTML from 'utils/convertToHTML';
import LoadingPage from 'components/common/LoadingPage';
import { Image } from '@chakra-ui/image';
import { Button } from '@chakra-ui/button';
import { GlobalContext } from 'context/GlobalContext';
import setTabName from 'utils/setTabName';

const menu = {
  post: 0,
  comment: 1,
  community: 2,
};

const Search = () => {
  const { search } = useLocation();
  const history = useHistory();

  const { isAuthenticated, joinedCommunities, joinCommunity, quitCommunity } =
    useContext(GlobalContext);

  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [communities, setCommunity] = useState([]);

  useEffect(() => {
    setTabName('Tìm kiếm');
  }, []);

  useEffect(() => {
    if (search) {
      const { search: _search } = queryString.parse(search);
      console.log({search});
      if (_search) {
        setSearchText(_search);
        setLoading(true);
        http
          .get('/search', {
            params: { search: _search },
          })
          .then(res => {
            const { posts, comments, communities } = res.data;
            console.log({posts, comments, communities});
            setPosts(posts);
            setComments(comments);
            setCommunity(communities);
            setLoading(false);
          })
          .catch(err => console.log(err));
      }
    }
  }, [search]);

  const isJoinedCommunity = id =>
    joinedCommunities.findIndex(
      community => community.community?._id === id
    ) !== -1;

  const [activeTab, setActiveTab] = useState(menu.post);

  const hightLightTextSearch = str => {
    if (!searchText) return { __html: '' };
    const searchRegExp = new RegExp(searchText, 'gi');
    const result = str
      ?.toString()
      .replace(
        searchRegExp,
        `<span style="background: yellow">${searchText}</span>`
      );

    return { __html: result };
  };

  return (
    <HStack maxW="70em" spacing="4" align="flex-start" px="1em">
      {loading && <LoadingPage />}

      {/* main content */}
      <Box flex="1" bg="white" borderRadius="md" minH="5em" p="1em">
        <HStack
          spacing="8"
          borderBottom="1px solid"
          borderColor="gray.400"
          // py="1em"
        >
          <Text
            as="b"
            fontSize="lg"
            px="0.5em"
            cursor="pointer"
            borderColor="gray.400"
            color={activeTab === menu.post ? 'teal' : ''}
            borderBottom={activeTab === menu.post ? '2px solid' : ''}
            onClick={() => {
              if (activeTab !== menu.post) setActiveTab(menu.post);
            }}
          >
            Bài viết {`(${posts.length})`}
          </Text>
          <Text
            as="b"
            fontSize="lg"
            px="0.5em"
            cursor="pointer"
            borderColor="gray.400"
            color={activeTab === menu.comment ? 'teal' : ''}
            borderBottom={activeTab === menu.comment ? '2px solid' : ''}
            onClick={() => {
              if (activeTab !== menu.comment) setActiveTab(menu.comment);
            }}
          >
            Bình luận {`(${comments.length})`}
          </Text>
          <Text
            as="b"
            fontSize="lg"
            px="0.5em"
            cursor="pointer"
            borderColor="gray.400"
            color={activeTab === menu.community ? 'teal' : ''}
            borderBottom={activeTab === menu.community ? '2px solid' : ''}
            onClick={() => {
              if (activeTab !== menu.community) setActiveTab(menu.community);
            }}
          >
            Cộng đồng {`(${communities.length})`}
          </Text>
        </HStack>

        <Box py="1em">
          {activeTab === menu.post &&
            posts.map(post => (
              <Box py="1em" borderBottom="1px solid" borderColor="gray.400">
                <HStack>
                  <Avatar
                    name={post.author?.username}
                    src={imagePath(post.author?.avatar)}
                  />

                  <Box textAlign="left">
                    <HStack>
                      <HStack>
                        <Text
                          fontWeight="600"
                          color="blue.700"
                          cursor="pointer"
                        >
                          {post.author?.username}
                        </Text>
                        <Text>.</Text>
                        <Text
                          fontWeight="600"
                          color="blue.700"
                          cursor="pointer"
                        >
                          {post.community?.name}
                        </Text>
                      </HStack>
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
                    </HStack>
                    <Text fontSize="xs">{timeSince(post.createdAt)}</Text>
                  </Box>
                </HStack>
                <Box textAlign="left">
                  <Link to={`/bai-viet/${post._id}`}>
                    <Text
                      fontWeight="600"
                      fontSize="xl"
                      color="black"
                      mt="0.5em"
                      dangerouslySetInnerHTML={hightLightTextSearch(post.title)}
                    ></Text>
                    <Text
                      fontSize="md"
                      className="three-line-text"
                      my="1em"
                      className="three-line-text"
                      dangerouslySetInnerHTML={hightLightTextSearch(
                        convertToHTML(post.content).__html
                      )}
                    ></Text>
                  </Link>
                </Box>
              </Box>
            ))}

          {activeTab === menu.comment &&
            comments.map(comment => (
              <Box py="1em" borderBottom="1px solid" borderColor="gray.400">
                <HStack>
                  <Avatar
                    name={comment.author?.username}
                    src={imagePath(comment.author?.avatar)}
                  />

                  <Box textAlign="left">
                    <HStack>
                      <HStack>
                        <Text
                          fontWeight="600"
                          color="blue.700"
                          cursor="pointer"
                        >
                          {comment.author?.username}
                        </Text>
                        <Text>.</Text>
                        <Text
                          fontWeight="600"
                          color="blue.700"
                          cursor="pointer"
                        >
                          {comment.post?.title}
                        </Text>
                      </HStack>
                      {comment.author?.tag && (
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
                    </HStack>
                    <Text fontSize="xs">{timeSince(comment.createdAt)}</Text>
                  </Box>
                </HStack>
                <Box textAlign="left">
                  <Link to={`/bai-viet/${comment._id}`}>
                    <Text
                      fontWeight="600"
                      color="black"
                      mt="0.5em"
                      dangerouslySetInnerHTML={hightLightTextSearch(
                        comment.content
                      )}
                    ></Text>
                  </Link>
                </Box>
              </Box>
            ))}

          {activeTab === menu.community &&
            communities.map(community => (
              <HStack
                key={community._id}
                justify="space-between"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                <HStack h="4em" p="0.5em" spacing="4">
                  <Text>1</Text>
                  <Image
                    boxSize="3em"
                    objectFit="cover"
                    borderRadius="md"
                    src={imagePath(community.avatar)}
                  />
                  <Box flex="1">
                    <Link to={`/cong-dong/${community._id}`}>
                      <Text
                        textAlign="left"
                        fontWeight="600"
                        dangerouslySetInnerHTML={hightLightTextSearch(
                          community.name
                        )}
                      ></Text>
                    </Link>
                    <HStack fontSize="xs" spacing="2">
                      <Text>{community.totalMember} Thành viên</Text>
                      <Text>.</Text>
                      <Text>{community.totalPost} Bài viết</Text>
                    </HStack>
                  </Box>
                </HStack>
                <Button
                  size="sm"
                  bg={
                    !isAuthenticated
                      ? 'blue.700'
                      : isJoinedCommunity(community._id)
                      ? 'teal'
                      : 'blue.700'
                  }
                  color="white"
                  my="0.5em"
                  _hover={{ bg: 'blue.600' }}
                  onClick={() => {
                    const communityId = community._id;
                    if (!isAuthenticated) history.push('/dang-nhap');
                    if (isJoinedCommunity(communityId))
                      quitCommunity(communityId);
                    else joinCommunity(communityId);
                  }}
                >
                  {!isAuthenticated
                    ? 'Tham gia'
                    : isJoinedCommunity(community._id)
                    ? 'Đã tham gia'
                    : 'Tham gia'}
                </Button>
              </HStack>
            ))}
        </Box>
      </Box>

      {/* right side
      <Box w="30%" bg="white" borderRadius="md" minH="5em" p="1em">
        <HStack
          justify="space-between"
          borderBottom="1px solid"
          borderColor="gray.400"
          py="0.5em"
        >
          <Text as="b">Lịch sử tìm kiếm</Text>
          <Text color="gray.400">Xoá tất cả</Text>
        </HStack>
      </Box> */}
    </HStack>
  );
};

export default Search;
