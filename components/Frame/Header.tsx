import {Box, Flex, Spacer, Heading, Center, Avatar} from '@chakra-ui/react';
import '@fontsource/permanent-marker';
import {Tooltip} from '@chakra-ui/react';
import {RiAddBoxLine} from 'react-icons/ri';
import {TbHeartHandshake} from 'react-icons/tb';
import IconChat from '../Logo/IconChat';
import IconHome from '../Logo/IconHome';
import useUser from '../Session/useUser';

const Header = () => {
  const user = useUser();
  return (
    <Box width="100%" height="2.5rem">
      <Flex height="100%">
        <Center height="100%">
          <Heading fontSize="2rem" fontFamily="Permanent Marker" ml=".5rem">
            NoraTomo
          </Heading>
        </Center>
        <Spacer />
        <Flex>
          <Tooltip label="メッセージ">
            <Center ml=".5rem">
              <IconChat size="27px" />
            </Center>
          </Tooltip>
          <Tooltip label="通知">
            <Center ml=".5rem">
              <TbHeartHandshake size="27px" />
            </Center>
          </Tooltip>
          <Tooltip label="募集を作成">
            <Center ml=".5rem">
              <RiAddBoxLine size="27px" />
            </Center>
          </Tooltip>
          <Tooltip label="ホーム">
            <Center ml=".5rem">
              <IconHome size="27px" />
            </Center>
          </Tooltip>
          <Tooltip label="マイページ">
            <Center mr=".5rem" ml=".5rem">
              <Avatar size="sm" src={user?.avatar_url} />
            </Center>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
