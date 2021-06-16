import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Input,
  Text,
  VStack
} from '@chakra-ui/react';
import MyModal from 'components/common/MyModal';
import { GlobalContext } from 'context/GlobalContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FiImage, FiInfo } from 'react-icons/fi';
import { MdClose, MdSend } from 'react-icons/md';
import { useHistory, useLocation } from 'react-router-dom';
import { searchQueryToObj, timeSince } from 'utils';
import http from 'utils/http';
import imagePath from 'utils/imagePath';
import setTabName from 'utils/setTabName';
import uploadFile from 'utils/uploadFile';


const Messages = () => {
  const { search } = useLocation();
  const history = useHistory();
  const { user, socket } = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  // selected room
  const chatRef = useRef();
  const [roomSelected, setRoomSelected] = useState();
  const [messages, setMessages] = useState([]);

  const chatFileRef = useRef();
  const chatFilePreviewRef = useRef();
  const [fileSelected, setFileSelected] = useState();
  const [chatInput, setChatInput] = useState('');

  // modal
  const [isShowSearchModal, setIsShowSearchModal] = useState(false);

  useEffect(() => {
    setTabName('Tin nhắn');

    http
      .get('/rooms')
      .then(res => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    async function loadInitSelectedRoom() {
      try {
        if (!loading && socket && search) {
          const { user: contactId } = searchQueryToObj(search);
          // set selected room
          let roomSelected;
          for (let i = 0; i < rooms.length; i++) {
            const memberIdx = rooms[i].members?.findIndex(
              member => member?._id === contactId
            );
            if (memberIdx !== -1) {
              roomSelected = rooms[i];
              break;
            }
          }
          if (!roomSelected) {
            const res = await http.post('/rooms/private', {
              contactId: contactId,
            });
            setRooms(preState => [res.data, ...preState]);
            roomSelected = res.data;
          }
          if (roomSelected) handleChangeRoom(roomSelected);
        }
      } catch (err) {
        console.log(err);
      }
    }
    loadInitSelectedRoom();
  }, [loading, search, rooms, socket]);

  const handleChangeRoom = room => {
    const other = getOtherMemberOfRoom(room.members);
    if (other) history.replace({ search: `?user=${other._id}` });

    setRoomSelected(room);
    // get messages history when room selected change

    http
      .get(`/rooms/${room._id}`)
      .then(async res => {
        await setMessages(res.data);
      })
      .catch(err => console.error(err));

    const roomId = room._id;
    const members = room.members?.map(member => member._id);
    if (socket && roomId && members?.length) {
      socket.emit('join-room', {
        roomId,
        members,
      });
    }
  };

  const scrollChatHistoryToBottom = () => {
    if (chatRef?.current) {
      const { scrollHeight, clientHeight, scrollTop } = chatRef.current;
      // if (scrollTop + 10 < scrollHeight - clientHeight) {
      //   alert("not bottom");
      //   return;
      // }
      chatRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  useEffect(() => {
    scrollChatHistoryToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket && roomSelected) {
      socket.on('new-message', payload => {
        if (payload.room === roomSelected._id) {
          console.log(payload);
          setMessages(preState => [...preState, payload]);
        }
      });
    }
  }, [socket, roomSelected]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() && !fileSelected) return;

    if (socket) {
      let payload = { content: chatInput, file: null };
      if (fileSelected) {
        const file = await uploadFile(fileSelected);
        payload = { ...payload, file };
      }
      socket.emit('send-message', payload);
      setChatInput('');
      setFileSelected(undefined);
    }
  };

  const getOtherMemberOfRoom = members =>
    members?.find(member => member._id && member._id !== user._id);

  return (
    <HStack
      pos="absolute"
      top="0.25em"
      left="10em"
      right="10em"
      bottom="0.25em"
      align="flex-start"
      justify="stretch"
      border="1px solid"
      borderColor="gray.400"
      bg="white"
      spacing="0"
      overflow="hidden"
    >
      <MyModal
        isOpenModal={isShowSearchModal}
        setCloseModal={setIsShowSearchModal}
        size="4xl"
      ></MyModal>

      {/* left */}
      <Box
        h="100%"
        w="20em"
        align="center"
        justify="center"
        pos="relative"
        borderRight="1px solid"
        borderColor="gray.400"
      >
        <HStack
          h="4em"
          borderBottom="1px solid"
          borderColor="gray.400"
          pos="relative"
          justify="center"
          fontWeight="bold"
        >
          <Text>{user.username}</Text>
          {user?.tag && (
            <Text
              fontWeight="bold"
              fontSize="sm"
              color="red.400"
              bg="gray.200"
              p="0.5em"
              borderRadius="md"
            >
              {user.tag}
            </Text>
          )}
        </HStack>

        <Box maxH="calc(100% - 64px)" overflowY="scroll">
          {rooms.map(room => (
            <HStack
              key={room._id}
              p="0.7em 1em"
              cursor="pointer"
              _hover={{
                bg: 'gray.50',
              }}
              spacing="4"
              onClick={() => handleChangeRoom(room)}
            >
              <Avatar
                name={getOtherMemberOfRoom(room.members)?.username}
                src={imagePath(getOtherMemberOfRoom(room.members)?.avatar)}
              />
              <Box textAlign="left">
                <Text fontWeight="600">
                  {getOtherMemberOfRoom(room.members)?.username}
                </Text>
               
                {room.lastMessage && (
                  <HStack spacing="4">
                    <Text fontSize="xs" as="i">
                      {room.lastMessage?.content}
                    </Text>
                    <Text fontSize="xs" as="i">
                      {timeSince(room.lastMessage?.createdAt)}
                    </Text>
                  </HStack>
                )}
              </Box>
              {getOtherMemberOfRoom(room.members)?.tag && (
                  <Text
                    fontWeight="bold"
                    fontSize="sm"
                    color="red.400"
                    bg="gray.200"
                    p="0.5em"
                    borderRadius="md"
                  >
                    {getOtherMemberOfRoom(room.members)?.tag}
                </Text>
                )}
            </HStack>
          ))}
        </Box>
      </Box>

      {/* right */}
      <Box flex="1" h="100%" pos="relative">
        {roomSelected ? (
          <>
            {' '}
            <HStack
              h="4em"
              borderBottom="1px solid"
              borderColor="gray.400"
              align="center"
              justify="space-between"
              px="1em"
            >
              <HStack>
                <Avatar
                  size="md"
                  name={getOtherMemberOfRoom(roomSelected.members)?.username}
                  src={imagePath(
                    getOtherMemberOfRoom(roomSelected.members)?.avatar
                  )}
                />
                <VStack align="flex-start" justify="flex-start" spacing="0">
                  <Text fontSize="lg" fontWeight="bold">
                    {getOtherMemberOfRoom(roomSelected.members)?.username}
                  </Text>
                  <Text fontSize="xs" as="i">
                    {/* Acitve 2 ago */}
                  </Text>
                </VStack>
                {getOtherMemberOfRoom(roomSelected.members)?.tag && (
                  <Text
                    fontWeight="bold"
                    fontSize="sm"
                    color="red.400"
                    bg="gray.200"
                    p="0.5em"
                    borderRadius="md"
                  >
                    {getOtherMemberOfRoom(roomSelected.members)?.tag}
                </Text>
                )}
              </HStack>
              
            </HStack>
            {/* messages history */}
            <Box
              maxH="calc(100% - 160px)"
              p="0.5em 1em"
              overflowY="scroll"
              ref={chatRef}
            >
              {messages.map(message =>
                message.user?._id === user._id ? (
                  <HStack key={message._id} py="0.5em" justify="flex-end">
                    <VStack align="flex-end">
                      {message.content && (
                        <Text bg="gray.200" p="0.5em 1em" borderRadius="3em">
                          {message.content}
                        </Text>
                      )}
                      {!!message.file?.filename && (
                        <Image
                          w="50%"
                          objectFit="cover"
                          src={imagePath(message.file?.filename)}
                          alt="image"
                        />
                      )}
                    </VStack>
                  </HStack>
                ) : (
                  <HStack key={message._id} py="0.5em" align="flex-start">
                    <Avatar
                      size="md"
                      name={
                        getOtherMemberOfRoom(roomSelected.members)?.username
                      }
                      src={imagePath(
                        getOtherMemberOfRoom(roomSelected.members)?.avatar
                      )}
                    />
                    <VStack align="flex-start">
                      {message.content && (
                        <Text bg="gray.200" p="0.5em 1em" borderRadius="3em">
                          {message.content}
                        </Text>
                      )}
                      {!!message.file?.filename && (
                        <Image
                          w="50%"
                          objectFit="cover"
                          src={imagePath(message.file?.filename)}
                          alt="image"
                        />
                      )}
                    </VStack>
                  </HStack>
                )
              )}
            </Box>
            {/* chat input */}
            <HStack
              pos="absolute"
              left="0"
              bottom="0"
              right="0"
              h="6em"
              p="1em"
              zIndex="1"
            >
              <Box flex="1" pos="relative">
                <Box
                  d={fileSelected ? 'block' : 'none'}
                  pos="absolute"
                  bottom="110%"
                  left="0"
                  textAlign="left"
                >
                  <span style={{ position: 'relative' }}>
                    <img
                      width="25%"
                      style={{
                        display: fileSelected ? 'block' : 'none',
                        border: '2px solid #666',
                      }}
                      ref={chatFilePreviewRef}
                    ></img>
                    <Icon
                      w="1.5em"
                      h="1.5em"
                      as={MdClose}
                      cursor="pointer"
                      color="black"
                      bg="red.400"
                      pos="absolute"
                      left="0"
                      top="0"
                      transform="translateY(-50%)"
                      zIndex="99"
                      borderRadius="3em"
                      onClick={() => {
                        setFileSelected(undefined);
                        chatFilePreviewRef.current.src = '';
                      }}
                    />
                  </span>
                </Box>
                <Input
                  px="2.25em"
                  size="lg"
                  borderRadius="3em"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                />
                <input
                  type="file"
                  ref={chatFileRef}
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files[0];

                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                      chatFilePreviewRef.current.src = reader.result;
                      setFileSelected(file);
                    };
                  }}
                />
                <Icon
                  w="1.5em"
                  h="1.5em"
                  as={FiImage}
                  cursor="pointer"
                  _hover={{
                    color: 'teal',
                  }}
                  pos="absolute"
                  left="0.75em"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex="1"
                  onClick={() => chatFileRef.current?.click()}
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
                  onClick={() => handleSendMessage()}
                />
              </Box>
            </HStack>
          </>
        ) : (
          <Button>Send message</Button>
        )}
      </Box>
    </HStack>
  );
};

export default Messages;
