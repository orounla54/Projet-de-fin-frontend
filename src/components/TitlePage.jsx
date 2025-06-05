import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

function TitlePage({ title, children }) {
  const params = useParams();

  // Extraire les valeurs des paramètres et les formater
  const paramsString = Object.values(params).join(' - ');

  return (
    <>
      <Helmet>
        <title>
          Super Tache - {title} {paramsString && `| ${paramsString}`}
        </title>
      </Helmet>
      <div>{children}</div>
    </>
  );
}

export default TitlePage;
