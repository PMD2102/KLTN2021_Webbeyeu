import { ChakraProvider, theme } from '@chakra-ui/react';
import 'App.css';
import Layout from 'components/common/Layout';
import AdminRoute from 'components/routing/AdminRoute';
import PrivateRoute from 'components/routing/PrivateRoute';
import PublicRoute from 'components/routing/PublicRoute';
import SignIn from 'containers/auth/SignIn';
import SignUp from 'containers/auth/SignUp';
import ResetPassword from 'containers/auth/ResetPassword';
import Community from 'containers/community/Community';
import Home from 'containers/home/Home';
import CreatePost from 'containers/post/CreatePost';
import Profile from 'containers/user-info/Profile';
import Admin from 'containers/admin';
import { GlobalContext } from 'context/GlobalContext';
import jwtDecode from 'jwt-decode';
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import history from 'utils/history';
import PendingPost from 'containers/post/PendingPost';
import Messages from 'containers/user-info/Messages';
import ApprovePost from 'containers/post/ApprovePost';
import SavedPost from 'containers/post/SavedPost';
import PendingComment from 'containers/comment/PendingComment';
import ApprovedComment from 'containers/comment/ApprovedComment';
import DetailCommunity from 'containers/community/DetailCommunity';
import DetailPost from 'containers/post/DetailPost';
import Search from 'containers/home/Search';

// import store from 'redux/store';
// import { Provider } from 'react-redux';

function App() {
  const { loading, setCurrentUser } = useContext(GlobalContext);

  useEffect(() => {
    if (loading) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now();
          if (decoded?.exp > currentTime / 1000) {
            setCurrentUser(decoded);
          } else {
            localStorage.removeItem('token');
            setCurrentUser({});
          }
        } catch (err) {
          console.error('err', err);
          localStorage.removeItem('token');
          setCurrentUser({});
        }
      } else {
        setCurrentUser({});
      }
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Router history={history}>
        <Layout>
          {!loading ? (
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute exact path="/dang-nhap" component={SignIn} />
              <PublicRoute exact path="/lay-lai-mat-khau" component={ResetPassword} />
              <PublicRoute exact path="/dang-ky" component={SignUp} />
              <Route exact path="/cong-dong" component={Community} />
              <Route
                exact
                path="/cong-dong/:communityId"
                component={DetailCommunity}
              />
              <Route exact path="/bai-viet/:postId" component={DetailPost} />
              <Route path="/tim-kiem" component={Search} />

              <PrivateRoute exact path="/:username/ho-so" component={Profile} />
              <PrivateRoute
                exact
                path="/bai-viet-cho-duyet"
                component={PendingPost}
              />
              <PrivateRoute exact path="/bai-viet" component={ApprovePost} />
              <PrivateRoute
                exact
                path="/bai-viet-da-luu"
                component={SavedPost}
              />
              <PrivateRoute
                exact
                path="/binh-luan"
                component={ApprovedComment}
              />
              <PrivateRoute
                exact
                path="/binh-luan-cho-duyet"
                component={PendingComment}
              />
              <PrivateRoute exact path="/tao-bai-viet" component={CreatePost} />
              <PrivateRoute path="/tin-nhan" component={Messages} />

              <AdminRoute exact path="/admin" component={Admin} />
            </Switch>
          ) : (
            <div>Loading</div>
          )}
        </Layout>
      </Router>
    </ChakraProvider>
  );
}

export default App;
