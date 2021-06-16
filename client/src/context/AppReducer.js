export default (state, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return {
        ...state,
        socket: action.payload,
      };

    case 'SET_USER':
      return {
        ...state,
        isAuthenticated: !!Object.keys(action.payload).length,
        user: action.payload,
        loading: false,
      };

    case 'LOGOUT_USER':
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };

    case 'GET_COMMUNITIES':
      return {
        ...state,
        communities: action.payload,
      };

    case 'ADD_COMMUNITY':
      return {
        ...state,
        communities: [...state.communities, action.payload],
      };

    case 'GET_JOINED_COMMUNITIES':
      return {
        ...state,
        joinedCommunities: action.payload,
      };

    case 'JOIN_COMMUNITY':
      return {
        ...state,
        joinedCommunities: [...state.joinedCommunities, action.payload],
      };

    case 'QUIT_COMMUNITY':
      return {
        ...state,
        joinedCommunities: state.joinedCommunities.filter(
          community => community._id !== action.payload._id
        ),
      };

    default:
      return state;
  }
};
