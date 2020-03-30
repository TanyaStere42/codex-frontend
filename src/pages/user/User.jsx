import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import NotFoundPage from '../../components/NotFoundPage';
import EncounterGallery from '../../components/EncounterGallery';
import { selectUsers } from '../../modules/users/selectors';
import userSchema from '../../constants/userSchema';

export default function User() {
  const { id } = useParams();

  // fetch data for Id...
  const users = useSelector(selectUsers);

  const user = users[id];
  if (!user)
    return (
      <NotFoundPage
        subtitle={<FormattedMessage id="USER_NOT_FOUND" />}
      />
    );

  return (
    <MainColumn>
      <EntityHeader
        name={user.name}
        imgSrc={user.profile}
        fieldValues={user.fields}
        fieldSchema={userSchema}
        editable={user.editable}
      />
      <EncounterGallery
        title={
          <FormattedMessage
            id="ENCOUNTERS_WITH"
            values={{ name: user.name }}
          />
        }
        encounters={user.encounters}
      />
    </MainColumn>
  );
}
