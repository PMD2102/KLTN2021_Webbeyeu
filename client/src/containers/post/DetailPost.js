import { Avatar, Box, Button, HStack, Icon, Input, Text, Tooltip } from '@chakra-ui/react';
import ImageGrid from 'components/common/ImageGrid';
import LoadingPage from 'components/common/LoadingPage';
import MainLayout from 'components/common/MainLayout';
import ToastNotify from 'components/common/ToastNotify';
import { REPORT_TYPE, BACKEND_URI } from 'constants/keys';
import { GlobalContext } from 'context/GlobalContext';
import path from 'path';
import React, { useContext, useEffect, useState } from 'react';
import {AiFillLike, AiOutlineLike } from 'react-icons/ai';
import {
  FaBookmark,
  FaFacebookSquare, FaFlag, FaRegComment
} from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { FacebookButton } from 'react-social';
import { removeAndAdd, timeSince } from 'utils';
import convertToHTML from 'utils/convertToHTML';
import http from 'utils/http';
import imagePath from 'utils/imagePath';
import { FacebookShareButton, FacebookIcon } from 'react-share';

const DetailPost = () => {
  const { postId } = useParams();
  const history = useHistory();
  

  const { isAuthenticated, joinedCommunities, joinCommunity, quitCommunity, user } = useContext(GlobalContext);

  const [posts, setPosts] = useState();
  const [commentInput, setCommentInput] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (postId)
      http
        .get(`/posts/${postId}`)
        .then(res => {setPosts(res.data); console.log(res.data);})
        .catch(error => console.error(error));
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
      .then(res =>
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
      {posts ? (
        <Box key={posts._id} bg="white" borderRadius="md" p="0.5em" mb="1em">
          <HStack
            justify="space-between"
            p="0.5em 1em"
            borderBottom="1px solid"
          >
            <HStack>
              <Avatar
                name={posts.community?.name}
                src={imagePath(posts.community?.avatar)}
              />
              <Text fontSize="xl" fontWeight="bold">
                {posts.community?.name}
              </Text>
            </HStack>
            <Button
              size="sm"
              bg={
                !isAuthenticated
                  ? 'blue.700'
                  : isJoinedCommunity(posts.community._id)
                  ? 'teal'
                  : 'blue.700'
              }
              color="white"
              my="0.5em"
              _hover={{ bg: 'blue.600' }}
              onClick={() => {
                const communityId = posts.community._id;
                if (!isAuthenticated) history.push('/dang-nhap');
                if (isJoinedCommunity(communityId)) quitCommunity(communityId);
                else joinCommunity(communityId);
              }}
            >
              {!isAuthenticated
                ? 'Tham gia'
                : isJoinedCommunity(posts.community._id)
                ? 'Đã tham gia'
                : 'Tham gia'}
            </Button>
          </HStack>
          <Box textAlign="left" p="0.5em 1em">
            <HStack>
              <Avatar
                name={posts.author?.username}
                src={imagePath(posts.author?.avatar)}
              />

              <Box textAlign="left">
                <HStack fontSize="md">
                  <Text fontWeight="600" color="blue.700" cursor="pointer">
                    {posts.author?.username}
                  </Text>
                  {posts.author?.tag && (
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      color="red.400"
                      bg="gray.200"
                      p="0.5em"
                      borderRadius="md"
                    >
                      {posts.author.tag}
                    </Text>
                    )}
                </HStack>
                <Text fontSize="xs">{timeSince(posts.createdAt)}</Text>
              </Box>
            </HStack>

            <Text fontWeight="600" fontSize="xl" color="black" mt="0.5em">
              {posts.title}
            </Text>
           
            <Text
              fontSize="md"
              my="1em"
              dangerouslySetInnerHTML={convertToHTML(posts.content)}
            ></Text>
            <ImageGrid images={posts.images?.map(img => imagePath(img))} />
            <HStack
              borderTop="1px solid"
              borderBottom="1px solid"
              borderColor="gray.200"
              justify="space-between"
            >
              <HStack spacing="8">
                <Tooltip label="Thích">
                  <HStack>
                    <Box p="0.5em" onClick={() => handleLikeOrUnlike(posts._id)}>
                      <Icon
                        w="2em"
                        h="2em"
                        cursor="pointer"
                        _hover={{ color: 'blue.700' }}
                        as ={(posts.likes.filter(like => like.user === user._id)).length ? AiFillLike: AiOutlineLike}
                      />
                    </Box>
                    <Text>{posts.totalLike}</Text>
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
                    <Text>{posts.totalComment}</Text>
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
                      onClick={() => handleSavePost(posts._id)}
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
                      onClick={() => handleReport(REPORT_TYPE.POST, posts._id)}
                    />
                  </Box>
                </Tooltip>
              </HStack>

              <Box p="0.5em">
              <FacebookShareButton url={`${BACKEND_URI}/bai-viet/${posts._id}`} >
                <FacebookIcon round={true} size={32} />
              </FacebookShareButton>
              </Box>
            </HStack>
            {/* comments */}
            {!!posts.comments?.length &&
              posts.comments.map(comment => (
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
              <Avatar size="sm" name={user.username} src={user.avatar} />
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
                  onClick={() => handleCommentPost(posts._id)}
                />
              </Box>
            </HStack>
          </Box>
        </Box>
      ) : (
        <LoadingPage />
      )}
    </MainLayout>
  );
};

export default DetailPost;
