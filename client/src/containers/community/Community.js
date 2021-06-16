import { Box, Button, HStack, Image, Text } from '@chakra-ui/react';
import MainLayout from 'components/common/MainLayout';
import { GlobalContext } from 'context/GlobalContext';
import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import imagePath from 'utils/imagePath';

const Community = () => {
  const {
    isAuthenticated,
    communities,
    joinedCommunities,
    joinCommunity,
    quitCommunity,
  } = useContext(GlobalContext);

  const history = useHistory();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const isJoinedCommunity = id =>
    joinedCommunities.findIndex(
      community => community.community?._id === id
    ) !== -1;

  return (
    <MainLayout>
      <Box bg="white" borderRadius="md" p="0.5em" mb="1em">
        <Text fontWeight="600">Xếp hạng cộng đồng</Text>

        {communities.slice(0, page * perPage).map((community, idx) => (
          <HStack
            key={community._id}
            justify="space-between"
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <HStack h="4em" p="0.5em" spacing="4">
              <Text>{idx + 1}</Text>
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
                    className="one-line-text"
                  >
                    {community.name}
                  </Text>
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
                if (isJoinedCommunity(communityId)) quitCommunity(communityId);
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

      {page * perPage < communities.length && (
        <Button
          w="100%"
          bg="blue.700"
          color="white"
          // my="0.5em"
          _hover={{ bg: 'blue.600' }}
          onClick={() =>
            page * perPage < communities.length &&
            setPage(preState => ++preState)
          }
        >
          Xem thêm
        </Button>
      )}
    </MainLayout>
  );
};

export default Community;
