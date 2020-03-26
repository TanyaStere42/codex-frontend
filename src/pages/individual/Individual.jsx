import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import NotFoundPage from '../../components/NotFoundPage';
import { selectIndividuals } from '../../modules/individuals/selectors';
import { selectSpeciesFields } from '../../modules/site/selectors';

export default function Individual() {
  const { id } = useParams();

  // fetch data for Id...
  const individuals = useSelector(selectIndividuals);
  const speciesFields = useSelector(selectSpeciesFields);

  const individual = individuals[id];
  if (!individual)
    return <NotFoundPage subtitle="Individual not found" />;

  const fieldSchema = speciesFields[individual.species];

  return (
    <MainColumn>
      <EntityHeader
        name={individual.name}
        imgSrc={individual.profile}
        fieldValues={individual.fields}
        fieldSchema={fieldSchema}
        editable={individual.editable}
      />
    </MainColumn>
  );
}
