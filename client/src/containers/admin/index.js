import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { ADMIN_MENU_KEYS } from 'constants/keys';
import Community from './Community';
import React, { useContext, useEffect, useState } from 'react';
import Censorship from './Censorship';
import Dashboard from './Dashboard';
import Posts from './Posts';
import Users from './Users';
import { GlobalContext } from 'context/GlobalContext';
import Report from './Report';
import setTabName from 'utils/setTabName';

const Admin = () => {
  const { logout } = useContext(GlobalContext);
  const [activeMenu, setActiveMenu] = useState(ADMIN_MENU_KEYS.users);

  useEffect(() => {
    setTabName('ADMIN');
  }, []);

  return (
    <>
      {/* left menu */}
      <VStack
        pos="absolute"
        top="0"
        left="0"
        bottom="0"
        w="15em"
        border="none"
        bg="gray.600"
        color="white"
        textAlign="left"
        p="1em"
        justify="space-between"
      >
        <Box>
          {/* <Text
            borderRadius="md"
            cursor="pointer"
            fontSize="xl"
            p="0.5em"
            my="1em"
            bg={activeMenu === ADMIN_MENU_KEYS.dashboard ? 'teal' : ''}
            _hover={{ opacity: 0.7 }}
            onClick={() => setActiveMenu(ADMIN_MENU_KEYS.dashboard)}
          >
            Dashboard
          </Text> */}
          <Text
            borderRadius="md"
            cursor="pointer"
            fontSize="xl"
            p="0.5em"
            my="1em"
            bg={activeMenu === ADMIN_MENU_KEYS.users ? 'teal' : ''}
            _hover={{ opacity: 0.7 }}
            onClick={() => setActiveMenu(ADMIN_MENU_KEYS.users)}
          >
            Quản lý người dùng
          </Text>
          <Text
            borderRadius="md"
            cursor="pointer"
            fontSize="xl"
            p="0.5em"
            my="1em"
            bg={activeMenu === ADMIN_MENU_KEYS.community ? 'teal' : ''}
            _hover={{ opacity: 0.7 }}
            onClick={() => setActiveMenu(ADMIN_MENU_KEYS.community)}
          >
            Quản lý cộng đồng
          </Text>
          <Text
            borderRadius="md"
            cursor="pointer"
            fontSize="xl"
            p="0.5em"
            my="1em"
            bg={activeMenu === ADMIN_MENU_KEYS.posts ? 'teal' : ''}
            _hover={{ opacity: 0.7 }}
            onClick={() => setActiveMenu(ADMIN_MENU_KEYS.posts)}
          >
            {' '}
            Quản lý bài viết
          </Text>
          <Text
            borderRadius="md"
            cursor="pointer"
            fontSize="xl"
            p="0.5em"
            my="1em"
            bg={activeMenu === ADMIN_MENU_KEYS.censorship ? 'teal' : ''}
            _hover={{ opacity: 0.7 }}
            onClick={() => setActiveMenu(ADMIN_MENU_KEYS.censorship)}
          >
            Quản lý bình luận
          </Text>
          <Text
            borderRadius="md"
            cursor="pointer"
            fontSize="xl"
            p="0.5em"
            my="1em"
            bg={activeMenu === ADMIN_MENU_KEYS.report ? 'teal' : ''}
            _hover={{ opacity: 0.7 }}
            onClick={() => setActiveMenu(ADMIN_MENU_KEYS.report)}
          >
            Quản lý báo cáo
          </Text>
        </Box>
        <Button
          bg="red.400"
          _hover={{ bg: 'red.200' }}
          onClick={() => logout()}
        >
          Đăng xuất
        </Button>
      </VStack>

      {/* right content */}
      <Box
        pos="absolute"
        top="0"
        left="15em"
        right="0"
        bottom="0"
        textAlign="left"
        overflowY="scroll"
        p="1em"
      >
        {activeMenu === ADMIN_MENU_KEYS.dashboard && <Dashboard />}
        {activeMenu === ADMIN_MENU_KEYS.users && <Users />}
        {activeMenu === ADMIN_MENU_KEYS.community && <Community />}
        {activeMenu === ADMIN_MENU_KEYS.posts && <Posts />}
        {activeMenu === ADMIN_MENU_KEYS.censorship && <Censorship />}
        {activeMenu === ADMIN_MENU_KEYS.report && <Report />}
      </Box>
    </>
  );
};

export default Admin;
