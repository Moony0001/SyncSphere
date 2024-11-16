import React, { useState } from 'react';
import Map from '../../components/common/Map';
function Form({ selectedSport, finalTime }) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const postData = {
      sport: selectedSport,
      duration: finalTime, // Timer value in seconds
      title,
      text,
      image,
    };
    console.log(postData);
    alert("Form saved!");
  };

  return ( 
    <div className="form-container">
    <br />
    <br />
      <div className="form-header">
        <h2>Make Your Spot Stand Out!</h2>
        <p>Fill in the details below to create a personalized entry.</p>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        className="form-input"
      />

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter description"
        className="form-input"
      />

      <div className="form-map-upload-block">
        <div className="form-map">
          {/* <Map/> */}
        </div>

        <div className="form-image-upload">
          {image ? (
            <img src={image} alt="Uploaded" className="uploaded-image" style={{ height: 167 }} />
          ) : (
            <div className="image-placeholder">Make this spot yours!</div>
          )}
          <label className="upload-button">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>
      <br />
      <button onClick={handleSave}  className="form-save-button">
        Save
      </button>
    </div>
    
  );
}

export default Form;
