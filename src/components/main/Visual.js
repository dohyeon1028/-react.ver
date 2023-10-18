import React from 'react'

function Visual() {

  return (
    <figure id='visual' className="myScroll">
      <video src={process.env.PUBLIC_URL + "/img/vid.pb4"} muted autoPlay loop></video>
    </figure>
  )
}

export default Visual