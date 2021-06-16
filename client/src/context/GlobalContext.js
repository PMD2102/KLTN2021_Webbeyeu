import React, { createContext, useReducer } from 'react';

import AppReducer from './AppReducer';
import { ROLE } from 'constants/keys';
import http from 'utils/http';
import ToastNotify from 'components/common/ToastNotify';

// init state
const initState = {
  isAuthenticated: false,
  user: {},
  loading: true,
  communities: [],
  joinedCommunities: [],
  socket: undefined,
};

// create context
export const GlobalContext = createContext(initState);

// provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initState);

  // async function register(data) {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:5000/api/v1/auth/register",
  //       data
  //     );

  //     if (res.data.success) {
  //       toast.success("Register Success! You can login now.", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //       setTimeout(() => (window.location.href = "/login"), 5000);
  //     }
  //   } catch (err) {
  //     handleErrors(err);
  //   }
  // }

  // async function login(data) {
  //   try {
  //     const res = await axios.post("users/sign-in", data);

  //     const { token } = res.data;
  //     // set token to localStorage
  //     localStorage.setItem("token", token);
  //     // set token to auth header
  //     setAuthToken(token);
  //     // decode token
  //     const decoded = jwt_decode(token);
  //     // set current user
  //     setCurrentUser(decoded);

  //     if (decoded.role === ROLE.ADMIN) {
  //       window.location.href = "/admin";
  //     } else {
  //       window.location.href = "/";
  //     }
  //   } catch (err) {
  //     handleErrors(err);
  //   }
  // }

  async function setSocket(socket) {
    dispatch({
      type: 'SET_SOCKET',
      payload: socket,
    });
  }

  function setCurrentUser(user) {
    dispatch({
      type: 'SET_USER',
      payload: user,
    });
  }

  function logout() {
    localStorage.removeItem('token');
    dispatch({
      type: 'LOGOUT_USER',
    });
  }

  async function getCommunities() {
    try {
      const res = await http.get('/community');
      dispatch({
        type: 'GET_COMMUNITIES',
        payload: res.data,
      });
    } catch (err) {
      // handleErrors(err);
      console.log(err);
    }
  }

  async function addCommunity(community) {
    dispatch({
      type: 'ADD_COMMUNITY',
      payload: community,
    });
  }

  async function getJoinedCommunities() {
    try {
      const res = await http.get('/community/join');
      dispatch({
        type: 'GET_JOINED_COMMUNITIES',
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function joinCommunity(communityId) {
    try {
      const res = await http.post('/community/join', { communityId });
      dispatch({
        type: 'JOIN_COMMUNITY',
        payload: res.data,
      });
      ToastNotify({
        title: 'Đã tham gia cộng đồng',
        status: 'success',
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function quitCommunity(communityId) {
    try {
      const res = await http.post('/community/quit', { communityId });
      dispatch({
        type: 'QUIT_COMMUNITY',
        payload: res.data,
      });
      ToastNotify({
        title: 'Thoát cộng đồng',
        status: 'success',
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        communities: state.communities,
        joinedCommunities: state.joinedCommunities,
        socket: state.socket,
        setSocket,
        setCurrentUser,
        logout,
        getCommunities,
        addCommunity,
        getJoinedCommunities,
        joinCommunity,
        quitCommunity,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
