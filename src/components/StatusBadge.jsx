import React from 'react'

function StatusBadge({status}) {
  return (
    <div className="m-1.5">
    {/* Start */}
    {status == "Non-démaré" &&
    <div className="text-sm inline-flex font-medium bg-gray-400/20 text-gray-500 dark:text-gray-400 rounded-full text-center px-2.5 py-1">
      Non démaré
    </div>
    }    
    {status == "En-cours" &&
    <div className="text-sm inline-flex font-medium bg-gray-400/20 text-gray-500 dark:text-gray-400 rounded-full text-center px-2.5 py-1">
      En cours
    </div>
    }    
    {status == "Terminé" &&
    <div className="text-sm inline-flex font-medium bg-gray-400/20 text-gray-500 dark:text-gray-400 rounded-full text-center px-2.5 py-1">
      Terminé
    </div>
    }
    {/* End */}
  </div>
  )
}

export default StatusBadge
