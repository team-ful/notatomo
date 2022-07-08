import {Box} from '@chakra-ui/react';
import type {NextPage} from 'next';
import Profile from '../components/Profile/UserProfile';
import Require from '../components/Session/Require';

const Setting: NextPage = () => {
  return (
    <Box>
      <Require loginRequire={true} path="/">
        <Profile />
      </Require>
    </Box>
  );
};

export default Setting;