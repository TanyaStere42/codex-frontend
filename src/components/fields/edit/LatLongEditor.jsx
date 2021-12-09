import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import LatLngMap from './mapUtils/LatLngMap';
import Button from '../../Button';
import StandardDialog from '../../StandardDialog';
import useDescription from '../../../hooks/useDescription';

function deriveGpsStringsFromValue(value) {
  const currentLatitude = get(value, '0', null);
  const currentLongitude = get(value, '1', null);
  return {
    latitudeString: currentLatitude ? currentLatitude.toString() : '',
    longitudeString: currentLongitude
      ? currentLongitude.toString()
      : '',
  };
}

export default function LatLongEditor({
  schema,
  value,
  onChange,
  minimalLabels = false,
  width = 280,
  ...rest
}) {
  const intl = useIntl();
  const description = useDescription(schema);

  const [modalOpen, setModalOpen] = useState(false);
  const [mapLatLng, setMapLatLng] = useState(null);

  const {
    latitudeString: initialLatitudeString,
    longitudeString: initialLongitudeString,
  } = useMemo(() => deriveGpsStringsFromValue(value));

  const [currentLatitudeString, setCurrentLatitudeString] = useState(
    initialLatitudeString,
  );
  const [
    currentLongitudeString,
    setCurrentLongitudeString,
  ] = useState(initialLongitudeString);

  useEffect(
    () => {
      const {
        latitudeString,
        longitudeString,
      } = deriveGpsStringsFromValue(value);

      setCurrentLatitudeString(latitudeString);
      setCurrentLongitudeString(longitudeString);
    },
    [get(value, '0'), get(value, '1')],
  );

  const currentLatitude = get(value, '0', null);
  const currentLongitude = get(value, '1', null);

  const onClose = () => setModalOpen(false);
  const showDescription = !minimalLabels && description;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          style={{ width }}
          id="gps-latitude"
          label={intl.formatMessage({ id: 'DECIMAL_LATITUDE' })}
          value={currentLatitudeString}
          onChange={e => {
            const inputValue = e.target.value;
            const floatValue = parseFloat(inputValue);
            if (Number.isNaN(floatValue)) {
              onChange([null, currentLongitude]);
            } else {
              onChange([floatValue, currentLongitude]);
            }
            setCurrentLatitudeString(inputValue);
          }}
        />
        <TextField
          style={{ width, margin: '8px 0' }}
          id="gps-longitude"
          label={intl.formatMessage({ id: 'DECIMAL_LONGITUDE' })}
          value={currentLongitudeString}
          onChange={e => {
            const inputValue = e.target.value;
            const floatValue = parseFloat(inputValue);
            if (Number.isNaN(floatValue)) {
              onChange([currentLatitude, null]);
            } else {
              onChange([currentLatitude, floatValue]);
            }
            setCurrentLongitudeString(inputValue);
          }}
        />
      </div>
      <Button
        size="small"
        onClick={() => setModalOpen(true)}
        style={{ marginTop: 4 }}
        id="CHOOSE_ON_MAP"
        {...rest}
      />
      {showDescription ? (
        <FormHelperText style={{ maxWidth: width }}>
          {description}
        </FormHelperText>
      ) : null}
      <StandardDialog
        open={modalOpen}
        onClose={onClose}
        titleId="SELECT_LOCATION"
      >
        <DialogContent style={{ marginBottom: 24 }}>
          <LatLngMap
            onChange={clickedPoint => setMapLatLng(clickedPoint)}
          />
        </DialogContent>
        <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
          <Button display="basic" onClick={onClose} id="CANCEL" />
          <Button
            display="primary"
            onClick={() => {
              onChange(mapLatLng);
              onClose();
            }}
            id="CONFIRM"
          />
        </DialogActions>
      </StandardDialog>
    </div>
  );
}
