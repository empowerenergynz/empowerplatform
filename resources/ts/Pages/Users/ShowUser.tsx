import React from 'react';
import { Container, HStack } from '@chakra-ui/react';
import usePermissions from 'src/Hooks/usePermissions';
import { Permissions } from 'src/Types/Permission';
import BorderBox from 'src/Theme/Components/BorderBox';
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionListItem,
  DescriptionTerm,
} from 'src/Theme/Components/DescriptionList';
import InertiaButtonLink from 'src/Theme/Components/InertiaButtonLink';
import UserRoleTags from 'src/Pages/Users/UserRoleTags';
import UserLayout, { UserLayoutProps } from 'src/Layouts/UserLayout';

type ShowUserPageProps = UserLayoutProps;

const ShowUser = ({ user }: ShowUserPageProps) => {
  const [canEditUser] = usePermissions([Permissions.EDIT_USERS]);

  const editButton = canEditUser && (
    <InertiaButtonLink href={`/users/${user.id}/edit`} variant="link">
      Edit
    </InertiaButtonLink>
  );

  return (
    <BorderBox label="USER DETAILS" action={editButton}>
      <Container alignSelf="center" p={0}>
        <DescriptionList mb={4}>
          <DescriptionListItem>
            <DescriptionTerm>First name</DescriptionTerm>
            <DescriptionDetails>{user.first_name}</DescriptionDetails>
          </DescriptionListItem>
          <DescriptionListItem>
            <DescriptionTerm>Last name</DescriptionTerm>
            <DescriptionDetails>{user.last_name}</DescriptionDetails>
          </DescriptionListItem>
          <DescriptionListItem>
            <DescriptionTerm>Phone number</DescriptionTerm>
            <DescriptionDetails>
              {user.phone_number || 'N/A'}
            </DescriptionDetails>
          </DescriptionListItem>
          <DescriptionListItem>
            <DescriptionTerm>Email address</DescriptionTerm>
            <DescriptionDetails>{user.email || 'N/A'}</DescriptionDetails>
          </DescriptionListItem>
          <DescriptionListItem>
            <DescriptionTerm>Roles</DescriptionTerm>
            <DescriptionDetails>
              <HStack mt={2} spacing={4}>
                <UserRoleTags user={user} />
              </HStack>
            </DescriptionDetails>
          </DescriptionListItem>
          {user.agency && (
            <DescriptionListItem>
              <DescriptionTerm>Agency</DescriptionTerm>
              <DescriptionDetails>{user.agency?.name}</DescriptionDetails>
            </DescriptionListItem>
          )}
          <DescriptionListItem>
            <DescriptionTerm>Reference</DescriptionTerm>
            <DescriptionDetails>{user.reference || 'N/A'}</DescriptionDetails>
          </DescriptionListItem>
        </DescriptionList>
      </Container>
    </BorderBox>
  );
};

ShowUser.layout = UserLayout.layout;

export default ShowUser;
