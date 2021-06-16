import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  Icon,
  Avatar,
  Input,
  VStack,
  Tooltip,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import setTabName from 'utils/setTabName';
import ImageGrid from 'components/common/ImageGrid';
import {AiFillLike, AiOutlineLike } from 'react-icons/ai';
import {
  FaRegComment,
  FaFlag,
  FaBookmark,
  FaFacebookSquare,
} from 'react-icons/fa';
import http from 'utils/http';
import { removeAndAdd, timeSince } from 'utils';
import imagePath from 'utils/imagePath';
import convertToHTML from 'utils/convertToHTML';
import { GlobalContext } from 'context/GlobalContext';
import { useHistory, Link, useLocation } from 'react-router-dom';
import MyModal from 'components/common/MyModal';
import { MdSend } from 'react-icons/md';
import ToastNotify from 'components/common/ToastNotify';
import { REPORT_TYPE, BACKEND_URI } from 'constants/keys';
import MainLayout from 'components/common/MainLayout';
import { FacebookButton } from 'react-social';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import path from 'path';
function Home() {
  const history = useHistory();
  const location = useLocation();
  const { isAuthenticated, user, joinedCommunities, joinCommunity, quitCommunity } =
    useContext(GlobalContext);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [isShowUserInfoModal, setIsShowUserInfoModal] = useState(false);
  const [userSelected, setUserSelected] = useState();

  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    setTabName('');

    http
      .get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  const isJoinedCommunity = id =>
    joinedCommunities.findIndex(
      community => community.community?._id === id
    ) !== -1;

  const handleLikeOrUnlike = postId => {
    if (!isAuthenticated) 
    ToastNotify({
      title: 'Vui lòng đăng nhập',
      status: 'warning',
    });
    http
      .get(`/posts/${postId}/like-or-unlike`)
      .then(res => {
        const { isLike, userLike } = res.data;
        if (typeof isLike !== 'undefined') {
          let post;
          const idx = posts.findIndex(e => {
            if (e._id === postId) {
              post = e;
              return true;
            }
            return false;
          });
          if (post) {
            if (!isLike) 
            { 
              post.totalLike++;
              post.likes.push(userLike);
            }
            else {
              post.totalLike--;
              post.likes = post.likes.filter(like => like.user !== user._id);
            }
            setPosts(removeAndAdd(posts, post, idx));
          }
        }
      })
      .catch(err => console.error(err));
  };

  const handleCommentPost = postId => {
    if (!isAuthenticated) 
    ToastNotify({
      title: 'Vui lòng đăng nhập',
      status: 'warning',
    });
    if (!commentInput.trim()) return;
    http
      .post(`/posts/${postId}/comment`, { content: commentInput })
      .then(res => {
        // let post;
        // const idx = posts.findIndex(e => {
        //   if (e._id === postId) {
        //     post = e;
        //     return true;
        //   }
        //   return false;
        // });
        // if (post) {
        //   post.totalComment++;
        //   setPosts(removeAndAdd(posts, post, idx));
        // }
        ToastNotify({
          title: 'Bình luận của bạn sẽ được admin duyệt',
          status: 'success',
        });
        setCommentInput('');
      })
      .catch(err => console.error(err));
  };

  const handleReport = (type, reportId) => {
    if (!isAuthenticated) {
    ToastNotify({
      title: 'Vui lòng đăng nhập',
      status: 'warning',
    });
    return;
    }
    http
      .post('/report', { type, reportId })
      .then(res =>
        ToastNotify({ title: 'Báo cáo thành công', status: 'success' })
      )
      .catch(err => {
        console.error(err.response);
        const errMessage = err.response?.data;
        errMessage &&
          ToastNotify({ title: errMessage.toString(), status: 'warning' });
      });
    };
  const handleSavePost = postId => {
    if (!isAuthenticated) {
      ToastNotify({
        title: 'Vui lòng đăng nhập',
        status: 'warning',
      });
      return;
      }
    http
      .post('/posts/saved', { postId })
      .then(rủ =>
        ToastNotify({ title: 'Lưu bài viết thành công', status: 'success' })
      )
      .catch(err => {
        console.error(err.response);
        const errMessage = err.response?.data;
        errMessage &&
          ToastNotify({ title: errMessage.toString(), status: 'warning' });
      });
    };

  return (
    <MainLayout>
      <MyModal
        isOpenModal={isShowUserInfoModal}
        setCloseModal={setIsShowUserInfoModal}
        isCentered={false}
      >
        <VStack align="center" justify="center">
          <Avatar
            size="2xl"
            name={userSelected?.username}
            src={imagePath(userSelected?.avatar)}
          />
          <Text>{userSelected?.username}</Text>
          {isAuthenticated ? (
              userSelected?._id === user._id ? (
                <Link to={{
                  pathname: `/${user.username}/ho-so`,
                  search:''
                }}>
                  <Button colorScheme="blue">Thông tin cá nhân</Button>
                </ Link>
              ) : (
                <HStack>
                  <Link to={{
                    pathname: '/tin-nhan',
                    search: `?user=${userSelected?._id}`
                  }}>
                    <Button colorScheme="blue">Nhắn tin</Button>
                  </Link>
                  <Button
                    colorScheme="pink"
                    onClick={() =>
                      handleReport(REPORT_TYPE.USER, userSelected?._id)
                    }
                  >
                    Báo cáo
                  </Button>
                </HStack>
              )
          ) : (
            <Button
              colorScheme="blue"
              onClick={() => history.push('/dang-nhap')}
            >
              Nhắn tin
            </Button>
          )}
        </VStack>
      </MyModal>

      {/* list items */}
      {posts.slice(0, page * perPage).map(post => (
        <Box key={post._id} bg="white" borderRadius="md" p="0.5em" mb="1em">
          {/* header */}
          <HStack justify="space-between">
            <HStack>
              <Image
                borderRadius="md"
                boxSize="3em"
                objectFit="cover"
                src={imagePath(post.community?.avatar)}
              />

              <Box textAlign="left">
                <Link to={`/cong-dong/${post.community?._id}`}>
                  <Text fontWeight="600" color="blue.700">
                    {post.community?.name}
                  </Text>
                </Link>
                <HStack fontSize="md">
                  <Text>Đăng bởi</Text>
                  <Text
                    fontWeight="600"
                    color="blue.700"
                    cursor="pointer"
                    onClick={() => {
                      setUserSelected(post.author);
                      setIsShowUserInfoModal(true);
                    }}
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
                      {post.author?.tag}
                    </Text>
                  )}
                  <Text as="sup">.</Text>
                  <Text>{timeSince(post.createdAt)}</Text>
                </HStack>
              </Box>
            </HStack>
            <Button
              size="sm"
              bg={
                !isAuthenticated
                  ? 'blue.700'
                  : isJoinedCommunity(post.community._id)
                  ? 'teal'
                  : 'blue.700'
              }
              color="white"
              my="0.5em"
              _hover={{ bg: 'blue.600' }}
              onClick={() => {
                const communityId = post.community._id;
                if (!isAuthenticated) history.push('/dang-nhap');
                if (isJoinedCommunity(communityId)) quitCommunity(communityId);
                else joinCommunity(communityId);
              }}
            >
              {!isAuthenticated
                ? 'Tham gia'
                : isJoinedCommunity(post.community._id)
                ? 'Đã tham gia'
                : 'Tham gia'}
            </Button>
          </HStack>

          {/* content */}
          <Box textAlign="left">
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
              <ImageGrid images={post.images?.map(img => imagePath(img))} />
            </Link>
            <HStack
              borderTop="1px solid"
              borderBottom="1px solid"
              borderColor="gray.200"
              justify="space-between"
            >
              <HStack spacing="8">
                <Tooltip label="Thích">
                  <HStack>
                    <Box p="0.5em" onClick={() => handleLikeOrUnlike(post._id)}>
                      <Icon
                        w="2em"
                        h="2em"
                        cursor="pointer"
                        _hover={{ color: 'blue.700' }}
                        as ={(post.likes.filter(like => like.user === user._id)).length ? AiFillLike: AiOutlineLike}
                      />
                    </Box>
                    <Text>{post.totalLike}</Text>
                  </HStack>
                </Tooltip>
             
                <Tooltip label="Bình luận">
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
                </Tooltip>

                <Tooltip label="Lưu bài viết">
                  <Box p="0.5em">
                    <Icon
                      w="2em"
                      h="2em"
                      cursor="pointer"
                      _hover={{ color: 'blue.700' }}
                      as={FaBookmark}
                      onClick={() => handleSavePost(post._id)}
                    />
                  </Box>
                </Tooltip>
                <Tooltip label="Báo cáo">
                  <Box p="0.5em">
                    <Icon
                      w="2em"
                      h="2em"
                      cursor="pointer"
                      _hover={{ color: 'blue.700' }}
                      as={FaFlag}
                      onClick={() => handleReport(REPORT_TYPE.POST, post._id)}
                    />
                  </Box>
                </Tooltip>
              </HStack>
              <Box p="0.5em">
              <FacebookShareButton url={`${BACKEND_URI}/bai-viet/${post._id}`} >
                <FacebookIcon round={true} size={32} />
              </FacebookShareButton>
              </Box>
            </HStack>
            {/* comments */}
            {!!post.comments?.length &&
              post.comments.map(comment => (
                <HStack key={comment._id} align="flex-start" my="0.5em">
                  <Avatar size="sm" name={comment.author.username} src={comment.author.avatar} />
                  <Box
                    flex="1"
                    p="0.5em 4em 0.5em 0.5em"
                    borderRadius="md"
                    bg="gray.100"
                    pos="relative"
                    className="comment"
                  >
                    <Text fontWeight="600">{comment.author?.username}</Text>
                    <Text>{comment.content}</Text>

                    <Box
                      d="none"
                      p="0.5em"
                      pos="absolute"
                      right="0"
                      top="50%"
                      transform="translateY(-50%)"
                      className="report-comment"
                    >
                      <Icon
                        w="2em"
                        h="2em"
                        cursor="pointer"
                        _hover={{ color: 'blue.700' }}
                        as={FaFlag}
                        onClick={() =>
                          handleReport(REPORT_TYPE.COMMENT, comment._id)
                        }
                      />
                    </Box>
                  </Box>
                </HStack>
              ))}
            {/* input comment */}
            <HStack my="0.5em">
              <Avatar size="sm" name={user.username} src={user.avatar}/>
              <Box flex="1" pos="relative">
                <Input
                  w="100%"
                  pr="2.5em"
                  borderRadius="3em"
                  placeholder="Viết bình luận..."
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                />
                <Icon
                  w="1.5em"
                  h="1.5em"
                  as={MdSend}
                  cursor="pointer"
                  _hover={{
                    color: 'teal',
                  }}
                  pos="absolute"
                  right="0.75em"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex="1"
                  onClick={() => handleCommentPost(post._id)}
                />
              </Box>
            </HStack>
          </Box>
        </Box>
      ))}
      {page * perPage < posts.length && (
        <Button
          colorScheme="blue"
          fontWeight="600"
          p="0.5em"
          cursor="pointer"
          onClick={() =>
            page * perPage < posts.length && setPage(preState => ++preState)
          }
        >
          Xem thêm
        </Button>
      )}
    </MainLayout>
  );
}

export default Home;
