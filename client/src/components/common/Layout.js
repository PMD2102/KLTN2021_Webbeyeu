import {
  Image,
  Box,
  Flex,
  HStack,
  Text,
  Icon,
  Input,
  VStack,
  Grid,
  Avatar,
} from '@chakra-ui/react';
import { GlobalContext } from 'context/GlobalContext';
import React, { useContext, useEffect, useState } from 'react';
import { FaBell, FaEdit, FaSearch } from 'react-icons/fa';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { MdArrowDropDown } from 'react-icons/md';
import {
  ADMIN_PATH,
  BACKEND_URI,
  NOTIFY_TYPE,
  POST_STATUS,
  ROLE,
} from 'constants/keys';
import imagePath from 'utils/imagePath';
import http from 'utils/http';
import socketClient from 'socket.io-client';

const Layout = ({ children, location }) => {
  const { pathname } = useLocation();
  const history = useHistory();

  const {
    isAuthenticated,
    user,
    logout,
    getJoinedCommunities,
    getCommunities,
    socket,
    setSocket,
  } = useContext(GlobalContext);

  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);

  const [isShowNotify, setIsShowNotify] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifyCount, setNotifyCount] = useState(0);

  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    setSocket(
      socketClient.connect(BACKEND_URI, {
        query: { token },
      })
    );
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new-notification', payload => {
        setNotifyCount(preState => ++preState);
        setNotifications(preState => [payload, ...preState]);
      });
    }
  }, [socket]);

  useEffect(() => {
    setIsAdminPage(pathname.includes(ADMIN_PATH));
  }, [pathname]);

  const getNotifications = () =>
    http
      .get('/users/notifications')
      .then(res => {
        setNotifications(res.data);
        setNotifyCount(res.data?.length);
      })
      .catch(err => console.log(err));

  useEffect(() => {
    getCommunities();

    if (isAuthenticated) {
      getJoinedCommunities();
      getNotifications();
    }
  }, [isAuthenticated]);

  const handleReadNotifications = () =>
    http
      .post('/users/notifications')
      .then(res => setNotifyCount(0))
      .catch(err => console.log(err));

  useEffect(() => {
    if (!!notifyCount && isShowNotify) {
      handleReadNotifications();
    }
  }, [notifyCount, isShowNotify]);

  const handleSearch = () => {
    const value = searchInput.trim();
    if (value) {
      history.push(`/tim-kiem?search=${value}`);
    }
  };

  return (
    <Box
      minH="100vh"
      justify="space-between"
      align="center"
      color="gray.600"
      bg="gray.200"
      pos="relative"
    >
      {/* header */}
      {!isAdminPage ? (
        <>
          <Box
            h="3.75em"
            borderBottom="1px solid"
            borderColor="gray.100"
            bg="white"
            px="1em"
          >
            <HStack maxW="80em" h="100%" justify="space-between" align="center">
              <HStack h="100%" spacing="12">
                <Box w="3.75em" cursor="pointer">
                  <Link to="/">
                    <Image
                      boxSize="100%"
                      objectFit="cover"
                      src='https://i.imgur.com/FqRxPeA.png'
                      alt="logo"
                    />
                  </Link>
                </Box>
                <Link to="/">
                  <Flex
                    align="center"
                    _hover={{
                      borderBottom: '1px solid',
                      borderColor: 'blue.700',
                      color: 'blue.700',
                      cursor: 'pointer',
                    }}
                  >
                    <Text fontWeight="600">Thịnh hành</Text>
                  </Flex>
                </Link>
                <Link to="/cong-dong">
                  <Flex
                    align="center"
                    _hover={{
                      borderBottom: '1px solid',
                      borderColor: 'blue.700',
                      color: 'blue.700',
                      cursor: 'pointer',
                    }}
                  >
                    <Text fontWeight="600">Cộng đồng</Text>
                  </Flex>
                </Link>
              </HStack>

              <Box flex="1" px="6em">
                <Box pos="relative">
                  <Icon
                    as={FaSearch}
                    w="1em"
                    h="1em"
                    pos="absolute"
                    top="50%"
                    left="1em"
                    transform="translateY(-50%)"
                    color="gray.500"
                    cursor="pointer"
                    onClick={() => handleSearch()}
                  />
                  <Input
                    borderRadius="3em"
                    pl="2.5em"
                    placeholder="Tìm kiếm cộng đồng, bài viết, bình luận"
                    _focus={{
                      borderColor: 'gray.600',
                    }}
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                </Box>
              </Box>

              <HStack spacing="6" align="stretch">
                <Link to="/tao-bai-viet">
                  <Box
                    p="0.5em"
                    borderRadius="50%"
                    cursor="pointer"
                    _hover={{ color: 'blue.700', bg: 'gray.100' }}
                  >
                    <Icon w="1.5em" h="1.5em" as={FaEdit} />
                  </Box>
                </Link>

                <Box
                  p="0.5em"
                  borderRadius="50%"
                  cursor="pointer"
                  pos="relative"
                  _hover={{ color: 'blue.700', bg: 'gray.100' }}
                  onClick={() => setIsShowNotify(preState => !preState)}
                >
                  <Icon w="1.5em" h="1.5em" as={FaBell} />
                  {!!notifyCount && (
                    <Text
                      pos="absolute"
                      top="0"
                      right="-0.5em"
                      as="b"
                      color="white"
                      px="0.5em"
                      borderRadius="3em"
                      fontSize="lg"
                      bg="red.400"
                    >
                      {notifyCount}
                    </Text>
                  )}
                  {isShowNotify && (
                    <Box
                      pos="absolute"
                      top="100%"
                      pos="absolute"
                      right="0"
                      w="17em"
                      bg="white"
                      zIndex="1"
                      style={{
                        marginTop: '1em',
                      }}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      p="1em"
                    >
                      {!notifications.length ? (
                        <Text fontStyle="lg" fontWeight="600">
                          No notifications
                        </Text>
                      ) : (
                        notifications.map(notify => (
                          <Box
                            key={notify._id}
                            textAlign="justify"
                            borderBottom="1px solid"
                            p="1em"
                          >
                            {notify.type === NOTIFY_TYPE.post
                              ? 'Bài viết'
                              : notify.type === NOTIFY_TYPE.comment
                              ? 'Bình luận'
                              : ''}{' '}
                            <Text d="inline" as="b">
                              "{notify.object}"
                            </Text>{' '}
                            {notify.status === POST_STATUS.APPROVE
                              ? 'đã được duyệt'
                              : notify.status === POST_STATUS.REJECT
                              ? 'đã bị từ chối'
                              : ''}
                          </Box>
                        ))
                      )}
                    </Box>
                  )}
                </Box>
                <Flex
                  align="center"
                  _hover={{
                    color: 'blue.700',
                    cursor: 'pointer',
                  }}
                >
                  {!isAuthenticated ? (
                    <Link to="/dang-nhap">
                      <Text fontWeight="600">Đăng nhập</Text>
                    </Link>
                  ) : (
                    <HStack
                      pos="relative"
                      onClick={() => setIsShowMenu(preState => !preState)}
                    >
                      <Avatar
                        size="sm"
                        name={user.username}
                        src={imagePath(user.avatar)}
                      />
                      <Text>{user.username}</Text>
                    
                      <Icon ml="0" as={MdArrowDropDown} w={8} h={8} />
                      {isShowMenu && (
                        <Box
                          pos="absolute"
                          top="100%"
                          right="0"
                          w="17em"
                          bg="white"
                          zIndex="1"
                          style={{
                            marginTop: '1em',
                          }}
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="md"
                          // boxShadow="5px 10px #888888;"
                        >
                          <Link to={`/${user.username}/ho-so`}>
                            <HStack p="0.75em 1em" _hover={{ bg: 'gray.50' }}>
                              <Image
                                boxSize="2em"
                                objectFit="cover"
                                borderRadius="md"
                                src="https://www.webtretho.com/static/img/info.png"
                              />
                              <Text fontWeight="600">Thông tin cá nhân</Text>
                            </HStack>
                          </Link>
                          <Link to="/tin-nhan">
                            <HStack p="0.75em 1em" _hover={{ bg: 'gray.50' }}>
                              <Image
                                boxSize="2em"
                                objectFit="cover"
                                borderRadius="md"
                                src="https://www.webtretho.com/static/img/message.png"
                              />
                              <Text fontWeight="600">Tin nhắn</Text>
                            </HStack>
                          </Link>
                          <Link to="/bai-viet">
                            <HStack p="0.75em 1em" _hover={{ bg: 'gray.50' }}>
                              <Image
                                boxSize="2em"
                                objectFit="cover"
                                borderRadius="md"
                                src="https://www.webtretho.com/static/img/user-post.png"
                              />
                              <Text fontWeight="600">Bài viết</Text>
                            </HStack>
                          </Link>
                          <Link to="/bai-viet-cho-duyet">
                            <HStack p="0.75em 1em" _hover={{ bg: 'gray.50' }}>
                              <Image
                                boxSize="2em"
                                objectFit="cover"
                                borderRadius="md"
                                src="https://www.webtretho.com/static/img/icon_check_approve.png"
                              />
                              <Text fontWeight="600">Bài viết chờ duyệt</Text>
                            </HStack>
                          </Link>

                          <Link to="/bai-viet-da-luu">
                            <HStack p="0.75em 1em" _hover={{ bg: 'gray.50' }}>
                              <Image
                                boxSize="2em"
                                objectFit="cover"
                                borderRadius="md"
                                src="https://www.webtretho.com/static/img/bookmark.png"
                              />
                              <Text fontWeight="600">Bài viết đã lưu</Text>
                            </HStack>
                          </Link>
                          {/* <Link to="/cong-dong-tham-gia">
                            <HStack p="0.75em 1em" _hover={{ bg: 'gray.50' }}>
                              <Image
                                boxSize="2em"
                                objectFit="cover"
                                borderRadius="md"
                                src="https://www.webtretho.com/static/img/user-community.png"
                              />
                              <Text fontWeight="600">
                                Cộng đồng đã tham gia
                              </Text>
                            </HStack>
                          </Link> */}
                          <Link to="/binh-luan">
                            <HStack p="0.75em 1em" _hover={{ bg: 'gray.50' }}>
                              <Image
                                boxSize="2em"
                                objectFit="cover"
                                borderRadius="md"
                                src="https://www.webtretho.com/static/img/user-comment.png"
                              />
                              <Text fontWeight="600">Bình luận</Text>
                            </HStack>
                          </Link>
                          <Link to="/binh-luan-cho-duyet">
                            <HStack p="0.75em 1em" _hover={{ bg: 'gray.50' }}>
                              <Image
                                boxSize="2em"
                                objectFit="cover"
                                borderRadius="md"
                                src="https://www.webtretho.com/static/img/cmt_pending.png"
                              />
                              <Text fontWeight="600">Bình luận chờ duyệt</Text>
                            </HStack>
                          </Link>
                          <HStack
                            p="0.75em 1em"
                            _hover={{ bg: 'red.200' }}
                            onClick={() => logout()}
                          >
                            <Image
                              boxSize="2em"
                              objectFit="cover"
                              borderRadius="md"
                              src="https://www.webtretho.com/static/img/logout.png"
                            />
                            <Text fontWeight="600">Thoát tài khoản</Text>
                          </HStack>
                        </Box>
                      )}
                    </HStack>
                  )}
                </Flex>
              </HStack>
            </HStack>
          </Box>

          <Box
            minH="calc(100vh - 310px)"
            maxW="80em"
            py="1em"
            onClick={() => {
              setIsShowMenu(false);
              setIsShowNotify(false);
            }}
            pos="relative"
          >
            {children}
          </Box>
          <Box bg="white">
            <Box borderBottom="1px solid" borderColor="gray.100">
              <Grid
                maxW="80em"
                templateColumns="repeat(5, 1fr)"
                gap={6}
                p="1em"
              >
                <Box w="100%">
                  <Image
                    w="100%"
                    objectFit="cover"
                    transform="scale(0.4)"
                    src="https://i.imgur.com/FqRxPeA.png"
                    alt="logo"
                  />
                </Box>
                <VStack align="left" w="100%" fontSize="xs" spacing="2">
                  <Text textAlign="left" fontWeight="600">
                    ĐẠI HỌC CÔNG NGHIỆP TP.HCM
                  </Text>
                  <Text textAlign="left">
                    12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh.
                  </Text>
                  <Text textAlign="left">Điện thoại: (+84) 0823 678 348</Text>
                  <Text textAlign="left">Hotline: 0935 027 834</Text>
                  <Text textAlign="left">Email: webtretho.kltn2021@gmail.com</Text>
                </VStack>
                <VStack align="left" w="100%" fontSize="xs" spacing="2">
                  <Text textAlign="left" fontWeight="600">
                    Sản phẩm
                  </Text>
                  <Text textAlign="left">Thịnh hành</Text>
                  <Text textAlign="left">Cộng đồng</Text>
                  <Text textAlign="left">Ngôi nhà Webbeyeu</Text>
                </VStack>
                <VStack align="left" w="100%" fontSize="xs" spacing="2">
                  <Text textAlign="left" fontWeight="600">
                    Liên kết và hợp tác
                  </Text>
                  <Text textAlign="left">Tinhte.vn</Text>
                  <Text textAlign="left">5giay.vn</Text>
                  <Text textAlign="left">Facebook Official</Text>
                  <Text textAlign="left">Liên hệ quảng cáo</Text>
                </VStack>

                <VStack align="left" w="100%" fontSize="xs" spacing="2">
                  <Text textAlign="left" fontWeight="600">
                    Lưu ý người dùng
                  </Text>
                  <Text textAlign="left">Câu hỏi thường gặp</Text>
                  <Text textAlign="left">Chính sách riêng tư</Text>
                  <Text textAlign="left">Điều khoản sử dụng</Text>
                  <Text textAlign="left">Qui định diễn đàn</Text>
                </VStack>
              </Grid>
            </Box>
          </Box>
        </>
      ) : (
        <> {children}</>
      )}
    </Box>
  );
};

export default Layout;
