import { Box, HStack, Image, Text } from '@chakra-ui/react';
import { GlobalContext } from 'context/GlobalContext';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import imagePath from 'utils/imagePath';

const MainLayout = ({ children }) => {
  const { communities } = useContext(GlobalContext);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  return (
    <HStack maxW="70em" spacing="4" align="flex-start">
      {/* main content */}
      <Box flex="1">{children}</Box>

      {/* right side */}
      <Box w="30%" bg="white" borderRadius="md" p="0.5em" textAlign="left">
        <Box border="1px solid" borderColor="gray.200">
          <Text fontSize="xl" fontWeight="600" p="0.5em">
            Cộng đồng mới nổi
          </Text>
          {/* list community */}
          {communities
            .sort((a, b) => +a.createdAt - b.createdAt)
            .slice(0, page * perPage)
            .map(community => (
              <HStack
                key={community._id}
                h="4em"
                p="0.5em"
                borderTop="1px solid"
                borderColor="gray.200"
              >
                <Image
                  boxSize="3em"
                  objectFit="cover"
                  src={imagePath(community.avatar)}
                />
                <Box flex="1">
                  <Link to={`/cong-dong/${community._id}`}>
                    <Text fontWeight="600" className="one-line-text">
                      {community.name}
                    </Text>
                  </Link>
                  <HStack fontSize="xs" spacing="2">
                    <Text>{community.totalMember} Thành viên</Text>
                    <Text as="sup">.</Text>
                    <Text>{community.totalPost} Bài viết</Text>
                  </HStack>
                </Box>
              </HStack>
            ))}
          {page * perPage < communities.length && (
            <Text
              borderTop="1px solid"
              borderColor="gray.200"
              textAlign="center"
              fontSize="md"
              fontWeight="600"
              p="0.5em"
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
              onClick={() =>
                page * perPage < communities.length &&
                setPage(preState => ++preState)
              }
            >
              Xem thêm
            </Text>
          )}
        </Box>
      </Box>
    </HStack>
  );
};

export default MainLayout;
