import React from 'react';
import { get } from 'lodash-es';

import OptionEditor from '../OptionEditor';
import TreeViewEditor from './TreeViewEditor';
import ConfigureDefaultField from './ConfigureDefaultField';

export function SpeciesEditor({
  onClose,
  onSubmit,
  formSettings,
  setFormSettings,
  ...rest
}) {
  const speciesOptions = get(formSettings, 'species', []);

  return (
    <OptionEditor
      open
      onClose={onClose}
      onSubmit={onSubmit}
      schema={{
        labelId: 'EDIT_SPECIES',
        descriptionId: 'EDIT_SPECIES_DESCRIPTION',
      }}
      value={speciesOptions}
      onChange={newOptions => {
        setFormSettings({
          ...formSettings,
          species: newOptions,
        });
      }}
      {...rest}
    />
  );
}

export function RelationshipEditor({
  onClose,
  onSubmit,
  formSettings,
  setFormSettings,
  ...rest
}) {
  const speciesOptions = get(formSettings, 'relationships', []);

  return (
    <OptionEditor
      open
      onClose={onClose}
      onSubmit={onSubmit}
      schema={{
        labelId: 'EDIT_RELATIONSHIPS',
        descriptionId: 'EDIT_RELATIONSHIPS_DESCRIPTION',
      }}
      value={speciesOptions}
      onChange={newOptions => {
        setFormSettings({
          ...formSettings,
          relationships: newOptions,
        });
      }}
      {...rest}
    />
  );
}

export function RegionEditor({
  onClose,
  onSubmit,
  formSettings,
  setFormSettings,
  children,
  ...rest
}) {
  const tree = get(formSettings, ['regions', 'locationID'], []);

  return (
    <ConfigureDefaultField onClose={onClose} onSubmit={onSubmit} open>
      <TreeViewEditor
        schema={{ labelId: 'REGIONS' }}
        value={tree}
        onChange={locationID => {
          const newRegions = {
            ...get(formSettings, 'regions', {}),
            locationID,
          };
          setFormSettings({
            ...formSettings,
            regions: newRegions,
          });
        }}
        {...rest}
      />
      {children}
    </ConfigureDefaultField>
  );
}
