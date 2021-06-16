import { Box, Button, HStack, Image, Input, Text } from '@chakra-ui/react';
import { GlobalContext } from 'context/GlobalContext';
import React, { useContext, useEffect, useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import uploadFile from 'utils/uploadFile';
// import history from 'utils/history';
import { useHistory } from 'react-router-dom';
import http from 'utils/http';
import { Stack } from 'immutable';
import ToastNotify from 'components/common/ToastNotify';
import imagePath from 'utils/imagePath';
import { useForm } from 'react-hook-form';

const CreatePost = () => {
  const history = useHistory();
  const { getJoinedCommunities, joinedCommunities } = useContext(GlobalContext);

  useEffect(() => {
    getJoinedCommunities();
  }, []);

  const [isShowSelectCommunity, setIsShowSelectCommunity] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [imageInput, setImageInput] = useState("https://www.webtretho.com/static/img/avatar.png");
  const [title, setTitle] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [imagesSelected, setImagesSelected] = useState([]);
  const [editorError, setEditorError] = useState(false)

  const onEditorStateChange = editorState => {
    setEditorState(editorState);
    setEditorError(true);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleCreatePost = () => {
    setEditorError(true);
    if (!Object.keys(errors).length) {

      if (((convertToRaw(editorState?.getCurrentContent())).blocks[0].text) === "" || 
         ((convertToRaw(editorState?.getCurrentContent())).blocks[0].text.length) < 12 ||
         ((convertToRaw(editorState?.getCurrentContent())).blocks[0].text.split(' ').length) < 5 ) 
         return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('communityId', selectedCommunity);
    formData.append(
      'content',
      JSON.stringify(convertToRaw(editorState?.getCurrentContent()))
    );

    for (let i = 0; i < imagesSelected.length; i++) {
      formData.append('images', imagesSelected[i]);
    }

    http
      .post('/posts', formData)
      .then(res => {
        history.push('/bai-viet-cho-duyet');
        ToastNotify({
          title: 'Tạo bài viết thành công',
          status: 'success',
        });
      })
      .catch(err => console.log(err));
    }
  };

  // console.log(JSON.stringify(convertToRaw(editorState?.getCurrentContent())));

  function uploadImageCallBack(file) {
    return new Promise((resolve, reject) => {
      uploadFile(file)
        .then(res => {
          // console.log(res);
          resolve(res.filename);
        })
        .catch(err => reject(err));
    });
  }

  return (
    <Box px="10em" textAlign="left">
      <Text fontSize="2xl" fontWeight="bold">
        Tạo bài viết
      </Text>
      <Text my="0.5em">Thông tin của bạn được bảo mật tuyệt đối</Text>
      <form onSubmit={handleSubmit(handleCreatePost)}>
        <Box pos="relative" pb="0.5em">
          <Input
            id="title"
            {...register('title', { required: true, maxLength: 100, minLength: 12})}
            bg="white"
            placeholder="Tiêu đề của bài"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
           {errors.title && (
            <Text
              pos="absolute"
              marginTop="40px"
              marginBottom="10px"
              left="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.title?.type === 'required'
                ? 'Tiêu đề bài viết là bắt buộc'
                : errors.title?.type === 'minLength'
                ? 'Tiêu đề bài viết ít nhất 12 ký tự '
                : errors.title?.type === 'maxLength'
                ? 'Tiêu đề bài viết tối đa 100 ký tự'
                : ''}
            </Text>
          )}
        </Box>

      <HStack my="0.7em" mb="1em">
        <Image
          boxSize="2.5em"
          objectFit="cover"
          src={imageInput}
          alt="Segun Adebayo"
          borderRadius="md"
        />
        <Box flex="1" pos="relative">
          <Input
            id="community"
            {...register('community', { required: true})}
            onChange={e => false}
            value={searchInput}
            onFocus={() =>
              !isShowSelectCommunity && setIsShowSelectCommunity(true)
            }
            bg="white"
            placeholder="Tìm kiếm cộng đồng"
          />
           {errors.community &&(
            <Text
              pos="absolute"
              marginTop="37px"
              left="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.community?.type === 'required' && searchInput === ""
                ? 'Chọn cộng đồng là bắt buộc'
                : ''}
            </Text>
          )}
          <Box
            d={isShowSelectCommunity ? 'block' : 'none'}
            pos="absolute"
            top="100%"
            left="0"
            right="0"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            p="0.5em"
            maxH="21em"
            overflowY="scroll"
            zIndex="999"
          >
            {joinedCommunities.map(community => ( 
              <HStack
              key={community._id}
              h="4em"
              p="0.5em"
              spacing="4"
              cursor="pointer"
              _hover={{ bg: 'gray.200' }}
              onClick={() => {
                setSearchInput(community.community?.name);
                setImageInput(imagePath(community.community?.avatar));
                setSelectedCommunity(community.community?._id);
                setIsShowSelectCommunity(false);
              }}
            >
              <Image
                boxSize="3em"
                objectFit="cover"
                borderRadius="md"
                src={imagePath(community.community.avatar)}
              />
              <Box flex="1">
                <Text fontWeight="600" className="one-line-text">
                  {community.community?.name}
                </Text>
              </Box>
            </HStack>
            ))}
          </Box>
        </Box>
      </HStack>
      <Box pos="relative" pb="0.5em">
      <Editor
        // id="content"
        // {...register('content', { required: true, minLength: 36 })}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: {
            uploadCallback: uploadImageCallBack,
            alt: { present: true, mandatory: true },
          },
        }}
      />
       {editorError &&(
            <Text
              pos="absolute"
              marginTop="1px"
              left="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {((convertToRaw(editorState?.getCurrentContent())).blocks[0].text) === ""
                ? 'Nội dung bài viết là bắt buộc'
                : ((convertToRaw(editorState?.getCurrentContent())).blocks[0].text.length) < 12
                ? 'Nội dung bài viết tối thiểu 12 ký tự'
                : ((convertToRaw(editorState?.getCurrentContent())).blocks[0].text.split(' ').length) < 5
                ? 'Nội dung bài viết tối thiểu 5 từ'
                : ''}
            </Text>
          )}
      </Box>
      <Box pos="relative" pb="0.5em" mt="0.7em">
        <input
          id="image"
          {...register('image', { required: true})}
          type="file"
          multiple="multiple"
          onChange={e => setImagesSelected(e.target.files)}
        />
        {errors.image && (
            <Text
              pos="absolute"
              marginTop="7"
              left="0"
              as="i"
              fontSize="xs"
              color="red.600"
            >
              {errors.image?.type === 'required'
                ? 'Hình ảnh bài viết là bắt buộc'
                : ''}
            </Text>
          )}
      </Box>

      <HStack mt="1em" justify="flex-end">
        <Button
          bg="white"
          onClick={() => {
            if (window.confirm('Bạn có chắc chắn muốn hủy thao tác?'))
              history.goBack();
          }}
        >
          Hủy
        </Button>
        <Button colorScheme="blue" type="submit">
          Đăng bài
        </Button>
      </HStack>
      </form>
    </Box>
  );
};

export default CreatePost;
