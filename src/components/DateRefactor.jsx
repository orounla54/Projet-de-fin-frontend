
import React from 'react'

function DateRefactor({ date }) {
    return (
        <span className="text-xs mt-7">
          {new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "numeric",
            day: "numeric"
          })}
        </span>
      );
}

export default DateRefactor
