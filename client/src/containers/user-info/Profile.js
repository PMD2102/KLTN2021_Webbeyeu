import {
  Avatar, Box,
  Button, Flex, HStack, Input, Radio, RadioGroup, Text, Tooltip
} from '@chakra-ui/react';
import ToastNotify from 'components/common/ToastNotify';
import { GlobalContext } from 'context/GlobalContext';
import jwtDecode from 'jwt-decode';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import http from 'utils/http';
import imagePath from 'utils/imagePath';
import uploadFile from 'utils/uploadFile';
import UserInfoLayout from './UserInfoLayout';
import UserInfoMenu from './UserInfoMenu';

const InputDatePicker = forwardRef(({ placeholder, value, onClick }, ref) => (
  <Input value={value} placeholder={placeholder} onClick={onClick} ref={ref} />
));

const userInfoType = {
  username: 0,
  name: 1,
  birth: 2,
  gender: 3,
  email: 4,
  phone: 5,
  avatar: 6,
};

const Profile = () => {
  const { user, setCurrentUser } = useContext(GlobalContext);

  const [selectedDate, setSelectedDate] = useState();
  const [birthSelectedDate, setBirthSelectedDate] = useState();
  const [userInfo, setUserInfo] = useState();

  const avatarRef = useRef();
  const avatarPreviewRef = useRef();
  const [avatarSelected, setAvatarSelected] = useState();

  useEffect(() => {
    http
      .get(`/users/${user._id}`)
      .then(res => setUserInfo(res.data))
      .catch(err => console.error(err));
  }, []);
  const handleChangeUserInfo = ({value, type }) => {
    switch (type) {
      case userInfoType.name:
        setUserInfo({ ...userInfo, name: value });
        break;
      case userInfoType.gender:
        setUserInfo({ ...userInfo, gender: value });
        break;
      case userInfoType.email:
        setUserInfo({ ...userInfo, email: value });
        break;
      case userInfoType.phone:
        setUserInfo({ ...userInfo, phone: value });
        break;
      case userInfoType.avatar:
        setUserInfo({ ...userInfo, avatar: value });
        break;
      default:
        break;
    }
  };

  const handleUpdateUserInfo = async () => {

    if (userInfo?.name === '' || 
        (userInfo?.name.split(' ').length < 2) ||
        (userInfo?.name.length > 50) ||  
        (userInfo?.phone.length < 10) 
       ) 
      return;

    http
      .put(`/users/${user._id}`, userInfo)
      .then(res => {
        ToastNotify({
          title: 'Cập nhật thông tin thành công',
          status: 'success',
        });
        const { token } = res.data;
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      })
      .catch(err => console.error(err));
  };

  const handleUpdateAvatar = async () => {
    try {
      if (!avatarSelected) return;
      const { filename } = await uploadFile(avatarSelected);
      const res = await http.put(`/users/${user._id}`, { avatar: filename });
      const { token } = res.data;
      if (token) {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      }

      handleChangeUserInfo({ value: filename, type: userInfoType.avatar });
      setAvatarSelected(undefined);
      ToastNotify({
        title: 'Cập nhật ảnh đại diện thành công',
        status: 'success',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnChange = e => {
    const file = e.target.files[0];
    setAvatarSelected(file);

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      avatarPreviewRef.current.src = reader.result;
    };
    // avatarPreviewRef.current.onload = function() {
    //   URL.revokeObjectURL( avatarPreviewRef.current?.src) // free memory
    // }
  };

  return (
    <UserInfoLayout>
      <Box flex="1" textAlign="left">
        <Box bg="white" borderRadius="md" p="1em">
          <HStack spacing="4">
            <input
              type="file"
              ref={avatarRef}
              style={{ display: 'none' }}
              onChange={e => handleOnChange(e)}
            />
            <Tooltip label="Tải ảnh lên">
              {avatarSelected ? (
                <img
                  ref={avatarPreviewRef}
                  alt="image"
                  style={{ cursor: 'pointer', maxWidth: '10em' }}
                  onClick={() => avatarRef.current?.click()}
                />
              ) : (
                <Avatar
                  size="xl"
                  name={userInfo?.username}
                  src={imagePath(userInfo?.avatar)}
                  ref={avatarPreviewRef}
                  cursor="pointer"
                  _hover={{ opacity: 0.7 }}
                  onClick={() => avatarRef.current?.click()}
                />
              )}
            </Tooltip>
            <Box>
              <Text fontWeight="600">Thay đổi ảnh đại diện của bạn</Text>
              <Text fontSize="xs">JPG, GIF, hoặc PNG. Kích cỡ tối đa 5MB</Text>
              <Button
                size="sm"
                bg="blue.700"
                color="white"
                fontWeight="600"
                _hover={{ bg: 'blue.600' }}
                onClick={() => handleUpdateAvatar()}
              >
                Đăng ảnh
              </Button>
            </Box>
          </HStack>

          {/* user's info form */}

          <Box py="0.5em">
            <Text fontWeight="600">Tên đăng nhập</Text>
            <Box>
              <Input
                value={userInfo?.username}
                disabled={true}
                placeholder="Tên đăng nhập"
              />
            </Box>
          </Box>
          <Box py="0.5em">
            <Text fontWeight="600">Họ và tên*</Text>
            <Box pos="relative" pb="1em">
              <Input
                value={userInfo?.name}
                onChange={e =>
                  handleChangeUserInfo({
                    value: e.target.value,
                    type: userInfoType.name,
                  })}  
                placeholder="Họ và tên"
              />
               {userInfo?.name && (
                <Text
                  pos="absolute"
                  left="0"
                  bottom="0"
                  as="i"
                  fontSize="xs"
                  color="red.600"
                >
                  {userInfo.name === ''
                    ? 'Họ và tên là bắt buộc'
                    : userInfo.name.length > 50
                    ? 'Họ và tên có độ dài dài nhất 50 ký tự'
                    :  userInfo.name.split(' ').length < 2
                    ? 'Họ và tên ít nhất có 2 từ'
                    : ''}
                </Text>
              )}
            </Box>
          </Box>
          {/* <Box py="0.5em">
            <Text fontWeight="600">Ngày sinh*</Text>
            <DatePicker
              selected={birthSelectedDate}
              onChange={date => setBirthSelectedDate(date)}
              placeholder="Ngày sinh"
              customInput={<InputDatePicker />}
            />
          </Box> */}
          <Box pb="0.5em">
            <Text fontWeight="600">Giới tính</Text>
            <Box>
              <RadioGroup
                value={userInfo?.gender}
                onChange={value =>
                  handleChangeUserInfo({
                    value: +value,
                    type: userInfoType.gender,
                  })
                }
              >
                <HStack>
                  <Radio value={1}>Nam</Radio>
                  <Radio value={2}>Nữ</Radio>
                  <Radio value={0}>Khác</Radio>
                </HStack>
              </RadioGroup>
            </Box>
          </Box>
          <Box py="0.5em">
            <Text fontWeight="600">Email*</Text>
            <Box>
              <Input
                disabled={true}
                placeholder="Email"
                value={userInfo?.email}
                onChange={e =>
                  handleChangeUserInfo({
                    value: e.target.value,
                    type: userInfoType.email,
                  })
                }
              />
            </Box>
          </Box>
          <Box py="0.5em">
            <Text fontWeight="600">Điện thoại</Text>
            <Box pos="relative" pb="1em">
              <Input
                value={userInfo?.phone}
                onChange={e =>
                  handleChangeUserInfo({
                    value: e.target.value,
                    type: userInfoType.phone,
                  })}
                placeholder="Điện thoại. Ví dụ: 0901234567, 0351234567,..."
                type="number"
              />
              {userInfo?.phone && (
              <Text
                pos="absolute"
                left="0"
                bottom="0"
                as="i"
                fontSize="xs"
                color="red.600"
              >
                {userInfo.phone.length < 10
                  ? 'Số điện thoại có độ ít nhất 10 '
                  : ''}
              </Text>
              )}
            </Box>
          </Box>
          {/* <Box py="0.5em">
            <Text fontWeight="600">CMTND/CCCD/Hộ chiếu</Text>
            <Box>
              <Input placeholder="CMTND/CCCD/Hộ chiếu" />
            </Box>
          </Box>
          <Box py="0.5em">
            <Text fontWeight="600">Ngày cấp</Text>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              customInput={<InputDatePicker />}
            />
          </Box>
          <Box py="0.5em">
            <Text fontWeight="600">Nơi cấp</Text>
            <Box>
              <Select defaultValue="">
                <option style={{ display: 'none' }} value="">
                  Nơi cấp
                </option>
                <option value="option1">HN</option>
                <option value="option2">TP. HCM</option>
                <option value="option3">TN</option>
              </Select>
            </Box>
          </Box> */}
           <Text
            as="i"
            fontSize="sm"
            color="red.600"
          >
            * là những trường bắt buộc không được để trống !!!
          </ Text>
          <Flex>
            <Button
              bg="blue.700"
              color="white"
              fontWeight="600"
              _hover={{ bg: 'blue.600' }}
              ml="auto"
              onClick={() => handleUpdateUserInfo()}
            >
              Lưu
            </Button>
          </Flex>
        </Box>
      </Box>

      {/* right side */}
      <UserInfoMenu />
    </UserInfoLayout>
  );
};

export default Profile;
