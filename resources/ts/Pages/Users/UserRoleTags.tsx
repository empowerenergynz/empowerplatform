import React from 'react';
import { Tag, Tooltip } from '@chakra-ui/react';
import { User } from 'src/Types/User';

const UserRoleTags = ({ user }: { user: User }) => {
  return (
    <>
      {user.roles.map((role) => (
        <Tooltip label={role.description} key={role.id}>
          <Tag
            size="md"
            backgroundColor="white"
            color={user.deleted_at ? 'gray.500' : role.color ?? ''}
            borderColor={user.deleted_at ? 'gray.500' : role.color ?? ''}
            borderWidth="2px"
            textTransform="uppercase"
          >
            {role.name}
          </Tag>
        </Tooltip>
      ))}
    </>
  );
};

export default UserRoleTags;
