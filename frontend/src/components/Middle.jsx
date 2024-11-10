import * as React from "react"
import circle from '../img/circle.png'
import watch from '../img/watch.png'

export default function Middle() {
  return (
    <div className="getting-started">
      {/* Background Image */}
      <div className="background-image">
        <img
          src={watch}// Placeholder image
          alt="Getting Started Background"
        />
      </div>

      {/* Content Section */}
      <div className="content">
        <h1 className="title">Getting Started</h1>

        {/* Step Section */}
        <div className="step">
          <div className="icon">
            
          </div>
          <div className="step-content">
            <div className="middle-description">
            <img src={circle}/>
            <h2 className="step-title">Record your first activity</h2>
            </div>
            <p className="step-description">
              Set up your GPS device and seamlessly upload your workouts right
              here
            </p>
          </div>
        </div>

        {/* Button */}
        <button className="connect-button">Record Activity</button>
      </div>
    </div>
  )
}
