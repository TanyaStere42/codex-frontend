import React, { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ViewList from '@material-ui/icons/ViewList';
import ViewMap from '@material-ui/icons/Language';

import { formatLocationFromSighting } from '../../utils/formatters';
import useOptions from '../../hooks/useOptions';
import { cellRendererTypes } from '../dataDisplays/cellRenderers';
import Text from '../Text';
import ActionIcon from '../ActionIcon';
import DataDisplay from '../dataDisplays/DataDisplay';
import Card from './Card';

/* While this displays an array of encounters, the card will often be 
"sightings of __individual_name__" or something like that. */
export default function EncountersCard({
  title,
  titleId = 'SIGHTINGS',
  encounters,
  columns = ['date', 'location', 'owner', 'actions'],
  noDataMessage = 'NO_SIGHTINGS',
  onDelete,
}) {
  const [showMapView, setShowMapView] = useState(false);
  const theme = useTheme();
  const { regionOptions } = useOptions();
  const intl = useIntl();

  const mapModeClicked = () => setShowMapView(true);
  const listModeClicked = () => setShowMapView(false);

  const encountersWithLocationData = useMemo(
    () => {
      // hotfix //
      if (!encounters) return [];
      // hotfix //

      return encounters.map(encounter => ({
        ...encounter,
        formattedLocation: formatLocationFromSighting(
          encounter,
          regionOptions,
          intl,
        ),
      }));
    },
    [get(encounters, 'length')],
  );

  const tooFewEncounters = encounters.length <= 1;

  const allColumns = [
    {
      reference: 'date',
      name: 'time',
      label: 'Date',
      options: { cellRenderer: cellRendererTypes.specifiedTime },
    },
    {
      reference: 'location',
      name: 'formattedLocation',
      label: 'Location',
      options: { cellRenderer: cellRendererTypes.location },
    },
    {
      reference: 'owner',
      name: 'owner',
      label: 'Owner',
      options: { cellRenderer: cellRendererTypes.user },
    },
    {
      reference: 'actions',
      name: 'guid',
      label: 'Actions',
      options: {
        customBodyRender: (_, encounter) => [
          <ActionIcon
            variant="view"
            href={`/sightings/${encounter?.sighting}`}
          />,
          <ActionIcon
            variant="removeEncFromIndividual" //note that we can't show a separate tool tip for when this is disabled... because tooltip doesn't work when disabled apparently
            disabled={tooFewEncounters}
            onClick={() => {
              onDelete(encounter?.guid);
            }}
          />,
        ],
      },
    },
  ];

  const filteredColumns = allColumns.filter(c =>
    columns.includes(c.reference),
  );

  const noEncounters = encounters && encounters.length === 0;

  return (
    <Card
      title={title}
      titleId={titleId}
      renderActions={
        <div>
          <IconButton
            style={
              showMapView ? {} : { color: theme.palette.primary.main }
            }
            aria-label="View list"
            onClick={listModeClicked}
          >
            <ViewList />
          </IconButton>
          <IconButton
            style={
              showMapView ? { color: theme.palette.primary.main } : {}
            }
            disabled={
              encountersWithLocationData.filter(entry =>
                get(entry, 'decimalLatitude'),
              ).length < 1
            }
            aria-label="View map"
            onClick={mapModeClicked}
          >
            <ViewMap />
          </IconButton>
        </div>
      }
    >
      {noEncounters && (
        <Text
          variant="body2"
          id={noDataMessage}
          style={{ marginTop: 12 }}
        />
      )}
      {!noEncounters && !showMapView && (
        <DataDisplay
          noTitleBar
          tableSize="medium"
          columns={filteredColumns}
          data={encountersWithLocationData}
        />
      )}
      {!noEncounters && showMapView && <div>Map goes here</div>}
    </Card>
  );
}
