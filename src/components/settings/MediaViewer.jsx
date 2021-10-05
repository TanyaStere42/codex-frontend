import React, { useEffect, useState, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import ReactPlayer from 'react-player';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import DashboardModal from '@uppy/react/lib/DashboardModal';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import VideoIcon from '@material-ui/icons/Movie';

import ActionIcon from '../ActionIcon';
import Button from '../Button';
import useSiteSettings from '../../models/site/useSiteSettings';
import Text from '../Text';
import StandardDialog from '../StandardDialog';
import CustomAlert from '../Alert';
import ConfirmDelete from '../ConfirmDelete';

export default function MediaViewer({
  key,
  variant = 'image',
  url,
  label,
  includeDeleteButton = false,
  settingKey,
}) {
  console.log('got here b1 and key is: ');
  console.log(key);
  // const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(false);
  const [deleteSettingFile, setDeleteSettingFile] = useState(false);
  const onCloseConfirmDelete = () => {
    console.log('deleteMe onCloseConfirmDelete entered');
    console.log('deleteMe error is:');
    console.log(error);
    if (error) setError(null);
    setDeleteSettingFile(false);
    // setConfirmDelete(null);
  };

  if (variant === 'image') {
    return (
      <div>
        <img
          alt={label}
          style={{
            maxHeight: 240,
            maxWidth: 240,
            height: 'auto',
            width: 'auto',
          }}
          src={url}
        />
        {includeDeleteButton && [
          <ActionIcon
            variant="delete"
            style={{
              position: 'absolute',
              height: '20px',
              padding: 0,
            }}
            onClick={() => setDeleteSettingFile(true)}
          />,
          <ConfirmDelete
            open={
              Boolean(deleteSettingFile)
              //   const response = await axios({
              //     url: `${__houston_url__}/api/v1/site-settings/${settingKey}`,
              //     withCredentials: true,
              //     method: 'delete',
              //   });
              //   console.log('deleteMe response is: ');
              //   console.log(response);
            }
            title={
              <FormattedMessage id="REMOVE_FILE" /> // onClose={onCloseConfirmDelete}
            }
            messageId={<FormattedMessage id="CONFIRM_DELETE_FILE" />}
            message={<FormattedMessage id="CONFIRM_DELETE_FILE" />}
            onClose={onCloseConfirmDelete}
            onDelete={async () => {
              setLoading(true);
              const deleteResponse = await axios({
                url: `${__houston_url__}/api/v1/site-settings/${settingKey}`,
                withCredentials: true,
                method: 'delete',
              });
              console.log('deleteMe response is: ');
              console.log(deleteResponse);
              const responseStatus = get(deleteResponse, 'status');
              const successful =
                responseStatus === 204 || responseStatus === 404; // 404 because if it couldn't be found, it hasn't been persisted yet, but the asset should be removed from the DOM anyway
              console.log('deleteMe got here a1');
              if (successful) {
                setLoading(false);
                // setSuccess(true);
                setError(null);
                console.log('deleteMe got here a2');
                onCloseConfirmDelete();
              }
              // const newCustomCategories = removeItemById(
              //   deleteCategory,
              //   customFieldCategories,
              // );
              // putSiteSetting(
              //   categorySettingName,
              //   newCustomCategories,
              // ).then(() => {
              //   onCloseConfirmDelete();
              // });
            }}
          />,
        ]}
      </div>
    );
  } else if (variant === 'video' && url) {
    return (
      <ReactPlayer
        url={url}
        height={240}
        width={360}
        muted
        autoPlay
        playing
        controls
      />
    );
  } else if (variant === 'video' && !url) {
    return (
      <Paper
        style={{ display: 'flex', padding: 20, alignItems: 'center' }}
      >
        <VideoIcon style={{ marginRight: 8 }} fontSize="large" />
        <Text variant="subtitle1">
          {label || 'Filename unavailable'}
        </Text>
      </Paper>
    );
  }

  return <Text>{label}</Text>;
}
