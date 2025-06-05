import React, { Fragment } from "react";

import EventSocieteItem from "../../components/EventSocieteItem";

function ShopCards01({ events, responsable }) {
  return (
    <>
      {/* Card 2 */}
      {events?.map((event) => (
        <>
          <EventSocieteItem
            event={event}
            responsable={responsable}
          />
        </>
      ))}
    </>
  );
}

export default ShopCards01;
