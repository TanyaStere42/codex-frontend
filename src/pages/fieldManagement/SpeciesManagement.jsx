import React from 'react';
import { useState } from 'react';
import { get } from 'lodash-es';
import Grid from '@material-ui/core/Grid';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useSiteSettings from '../../models/site/useSiteSettings';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import { useIntl, FormattedMessage } from 'react-intl';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import Button from '../../components/Button';
import ActionIcon from '../../components/ActionIcon';
import SpeciesEditor from './settings/defaultFieldComponents/SpeciesEditor';
import AddIcon from '@material-ui/icons/Add';
import PrefixEditor from './settings/defaultFieldComponents/PrefixEditor';
import Switch from '@material-ui/core/Switch';

export default function SpeciesManagement() {
  const { data: siteSettings, loading, error } = useSiteSettings();
  const intl = useIntl();
  const [editField, setEditField] = useState(null);
  const [addSpecies, setAddSpecies] = useState(false);

  const [codexIdEnabled, setCodexIdEnabled] = useState(true);

  useDocumentTitle('MANAGE_FIELDS');

  if (loading || error) return null;

  const tableColumns = [
    {
      name: 'labelId',
      label: intl.formatMessage({ id: 'SPECIES' }),
      options: {
        customBodyRender: labelId => (
          <FormattedMessage id={labelId} defaultMessage={labelId} />
        ),
      },
    },
    {
      name: 'prefix',
      label: intl.formatMessage({ id: 'ID_PREFIX' }),
      options: {
        customBodyRender: prefix => (
          <FormattedMessage id={prefix} defaultMessage={prefix} />
        ),
      },
    },
    {
      name: 'count',
      label: intl.formatMessage({ id: 'COUNT' }),
      options: {
        customBodyRender: count => (
          <FormattedMessage id={count} defaultMessage={count.toString()}/>
        ),
      },
    },

    {
      name: 'actions',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        customBodyRender: (_, species) => (
          <ActionIcon
            variant="edit"
            onClick={() => {              
              setEditField(species);               
            }}
          />
        ),
      },
    },
  ];

  const speciesTableData = get(siteSettings, ['site.species', 'value'], []);  
  const autogenerated_names = get(siteSettings, ['autogenerated_names', 'value'], {});  
  const speciesTableRows = speciesTableData.map((s) => {    
    const auto_names = Object.values(autogenerated_names).find((a) => a.reference_guid === s.id);
    const prefix = auto_names?.prefix || '-';
    const count = auto_names?.next_value - 1 || '-';
    return {
      id: s.id,      
      labelId: `${s.scientificName}\u00A0\u00A0\u00A0(${s.commonNames[0]})`,
      prefix: prefix,
      count: count,
    }
  })

    return  (
      <MainColumn>     
        {addSpecies && (
          <SpeciesEditor 
            codexIdEnabled={codexIdEnabled}
            onClose={() => {
              setAddSpecies(false);                          
          }}
            data={siteSettings}
            siteSettings={siteSettings}
            />
        )}   
        {editField && (
        <PrefixEditor          
          onClose={() => {
            setEditField(null);
          }}          
          siteSettings={siteSettings}
          species1={editField}         
        />
      )}      
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="MANAGE_SPECIES"
      />
      <SettingsBreadcrumbs currentPageTextId="MANAGE_SPECIES" />
      <Grid
        container
        direction="column"
        spacing={3}
        style={{ padding: 20 }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 12,
          marginBottom: 12,
        }}>
          {/* <div>
            <span style={{marginRight: 10, fontWeight:'bold'}}> {intl.formatMessage({ id: 'CODEX_ID' })} </span>
            <Switch 
                    checked = {codexIdEnabled}                
                    disabled
            />  
          </div> */}
          <Button  
            id = "ADD_SPECIES"            
            size="small"
            display="panel"
            startIcon={<AddIcon />}   
            onClick={() => {
                setAddSpecies(true);
            }}
              />
        </div>
      <DataDisplay
        style={{ marginTop: 8 }}
        noTitleBar
        variant="secondary"
        columns={tableColumns}
        data={speciesTableRows}
        tableContainerStyles={{ maxHeight: 1300 }}
      />
      </Grid>
    </MainColumn>
    );

}