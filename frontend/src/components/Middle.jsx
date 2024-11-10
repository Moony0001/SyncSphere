import * as React from "react"
import circle from './circle.png'
import watch from './watch.png'

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
        <p className="description">
          We’ve listed a couple of steps to help you get set up on Strava.
        </p>

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
              to Strava. No device? No problem – record and connect anytime,
              anywhere with our mobile app.
            </p>
          </div>
        </div>

        {/* Button */}
        <button className="connect-button">Connect Device</button>
      </div>
    </div>
  )
}
