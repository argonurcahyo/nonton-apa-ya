import React from 'react'

const NotFound = () => {
 const NOT_FOUND_IMG = "https://freight.cargo.site/w/1200/i/e41fad2d9aab5255be2f85773f8249d8fc1b9dcc5bfdb2699b83c101277f579d/ERRORANI.gif"
 return (
  <div style={{
   padding: "20px"
  }}>
   <img
    style={{ width: "100%" }}
    src={NOT_FOUND_IMG}
    alt="Error 404" />
  </div>
 )
}

export default NotFound