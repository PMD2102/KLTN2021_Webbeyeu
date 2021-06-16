import {
  Box,
  Button,
  Divider,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import MyModal from 'components/common/MyModal';
import ToastNotify from 'components/common/ToastNotify';
import { REPORT_TYPE } from 'constants/keys';
import React, { useEffect, useState } from 'react';
import { removeAndAdd, removeOfArrayByIdx } from 'utils';
import http from 'utils/http';

const menu = {
  all: -1,
  user: REPORT_TYPE.USER,
  post: REPORT_TYPE.POST,
  comment: REPORT_TYPE.COMMENT,
};

const Report = () => {
  const [activeTab, setActiveTab] = useState(menu.all);
  const [reports, setReports] = useState([]);
  const [isShowViewDeletelModal,setIsShowDeletelModal] = useState(false);
  const [reportSelected, setReportSelected] = useState();
  const [isShowViewDetailModal, setIsShowDetailModal] = useState(false);
  // const [postSelected, setPostSelected] = useState();

  useEffect(() => {
    http
      .get('/report')
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  }, []);
  const handleChangeTab = tab => {
    if (tab !== activeTab) setActiveTab(tab);
  };

  // const handleApproveOrReject = (commentId, isApprove) => {
  //   http
  //     .put(`/posts/comments/${commentId}`, {
  //       status: isApprove ? menu.approve : menu.reject,
  //     })
  //     .then(res => {
  //       const idx = comments.findIndex(comment => comment._id === commentId);
  //       setComments(removeAndAdd(comments, res.data, idx));
  //     })
  //     .catch(err => console.error(err));
  // };

  const handleDelete = reportId => {
    http
      .delete(`/report/${reportId}`)
      .then(res => {
        const idx = reports.findIndex(report => report._id === reportId);
        setReports(removeOfArrayByIdx(reports, idx));
        ToastNotify({
          title: 'Xóa báo cáo thành công',
          status: 'success',
        });
        setIsShowDeletelModal(false);
      })
      .catch(err => console.error(err));
  };
  console.log(reports);
  return (
    
    <Box>
      <MyModal
        isOpenModal={isShowViewDeletelModal}
        setCloseModal={setIsShowDeletelModal}
        title="Xác nhận"
        isCentered={false}
      >
        <Text>Bạn có muốn xóa báo cáo này không?</Text>
         <HStack justify="flex-end" mt="1em">
          <Button
            colorScheme="gray"
            onClick={() => setIsShowDeletelModal(false)}
          >
            Hủy
          </Button>
          <Button
          bg="red.400"
          _hover={{ bg: 'red.200' }}
          onClick={() => {
            handleDelete(reportSelected?._id);
          }}
          >
          Xóa
          </Button>
        </HStack>
      </MyModal>

      <HStack spacing="8">
        <Text
          p="0.5em 2em"
          fontWeight="bold"
          cursor="pointer"
          bg={activeTab === menu.all ? 'teal' : ''}
          color={activeTab === menu.all ? 'white' : ''}
          borderRadius="md"
          border="1px solid"
          _hover={{ bg: activeTab === menu.all ? '' : 'gray.300' }}
          onClick={() => handleChangeTab(menu.all)}
        >
          Tất cả
        </Text>
        <Text
          p="0.5em 2em"
          fontWeight="bold"
          cursor="pointer"
          bg={activeTab === menu.user ? 'teal' : ''}
          color={activeTab === menu.user ? 'white' : ''}
          borderRadius="md"
          border="1px solid"
          _hover={{ bg: activeTab === menu.user ? '' : 'gray.300' }}
          onClick={() => handleChangeTab(menu.user)}
        >
          Người dùng
        </Text>
        <Text
          p="0.5em 2em"
          fontWeight="bold"
          cursor="pointer"
          bg={activeTab === menu.post ? 'teal' : ''}
          color={activeTab === menu.post ? 'white' : ''}
          borderRadius="md"
          border="1px solid"
          _hover={{ bg: activeTab === menu.post ? '' : 'gray.300' }}
          onClick={() => handleChangeTab(menu.post)}
        >
          Bài viết
        </Text>
        <Text
          p="0.5em 2em"
          fontWeight="bold"
          cursor="pointer"
          bg={activeTab === menu.comment ? 'teal' : ''}
          color={activeTab === menu.comment ? 'white' : ''}
          borderRadius="md"
          border="1px solid"
          _hover={{ bg: activeTab === menu.comment ? '' : 'gray.300' }}
          onClick={() => handleChangeTab(menu.comment)}
        >
          Bình luận
        </Text>
      </HStack>

      <Divider my="0.5em" size="lg" colorScheme="blue" />

      <Table variant="simple" borderColor="gray.200">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Người báo cáo</Th>
            <Th>Đối tượng bị báo cáo</Th>
            {/* <Th>Detail</Th> */}
            <Th isNumeric></Th>
          </Tr>
        </Thead>

        <Tbody>
          {reports
            .filter(report =>
              activeTab === menu.all ? true : report.type === activeTab
            )
            .map((report, idx) => (
              <Tr key={idx}>
                <Td>{idx + 1}</Td>
                <Td>{report.reporter?.username}</Td>
                <Td>
                  {report.type === REPORT_TYPE.USER
                    ? report.user?.username
                    : report.type === REPORT_TYPE.POST
                    ? report.post?.title
                    : report.type === REPORT_TYPE.COMMENT
                    ? report.comment?.content
                    : 'N/A'}
                </Td>
                {/* <Td>
                  <Button
                    bg="blue.400"
                    as="i"
                    cursor="pointer"
                    color="white"
                    _hover={{ bg: 'blue.200' }}
                    // onClick={() => {
                    //   setPostSelected(post);
                    //   setIsShowDetailModal(true);
                    // }}
                  >
                    View
                  </Button>
                </Td> */}
                <Td color="white" isNumeric>
                  <HStack justify="flex-end">
                    <Button
                      bg="red.400"
                      _hover={{ bg: 'red.200' }}
                      onClick={() => { 
                        setReportSelected(report);
                        setIsShowDeletelModal(true);
                      }}
                    >
                      Xóa
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Report;
