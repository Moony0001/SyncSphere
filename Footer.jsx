import React from 'react';

const footerStyle = {
  backgroundColor: '#f7f7fa',
  padding: '40px 20px', // Regular padding for spacing
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  width: '100%', // Full width of the page
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  padding: '0 20px',
};

const sectionStyle = {
  flex: '1 1 200px',
  marginBottom: '10px', // Reduced margin to minimize height
};

const headingStyle = {
  color: '#242428',
  fontSize: '16px',
  fontWeight: 600,
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
};

const listItemStyle = {
  marginBottom: '5px', // Reduced margin between list items
};

const linkStyle = {
  color: '#606065',
  textDecoration: 'none',
  fontSize: '14px',
};

const socialIconsStyle = {
  display: 'flex',
  gap: '10px', // Slightly reduced gap to save space
};

const iconStyle = {
  color: '#606065',
  fontSize: '20px',
};

const appButtonsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px', // Reduced gap to minimize height
};

const appButtonImageStyle = {
  height: '35px', // Reduced height for smaller icons
  width: 'auto',
};

const footerBottomStyle = {
  textAlign: 'center',
  marginTop: '20px', // Standard margin
  paddingTop: '10px', // Standard padding to minimize height
  borderTop: '1px solid #e5e5e5',
};

const copyrightStyle = {
  color: '#606065',
  fontSize: '12px',
};

// Main content style without additional padding at the bottom
const contentStyle = {
  padding: '20px', // Standard padding for main content
};

export default function Page() {
  return (
    <div>
      <footer style={footerStyle}>
        <div style={containerStyle}>
          <div style={sectionStyle}>
            <h3 style={headingStyle}>About</h3>
            <ul style={listStyle}>
              <li style={listItemStyle}><a href="#" style={linkStyle}>About Strava</a></li>
              <li style={listItemStyle}><a href="#" style={linkStyle}>Features</a></li>
            </ul>
          </div>
          <div style={sectionStyle}>
            <h3 style={headingStyle}>Explore</h3>
            <ul style={listStyle}>
              <li style={listItemStyle}><a href="#" style={linkStyle}>Routes</a></li>
              <li style={listItemStyle}><a href="#" style={linkStyle}>Segments</a></li>
            </ul>
          </div>
          <div style={sectionStyle}>
            <h3 style={headingStyle}>Follow</h3>
            <div style={socialIconsStyle}>
              <a href="#" aria-label="Facebook" style={iconStyle}>
                <i className="icon-facebook"></i>
              </a>
              <a href="#" aria-label="Twitter" style={iconStyle}>
                <i className="icon-twitter"></i>
              </a>
              <a href="#" aria-label="Instagram" style={iconStyle}>
                <i className="icon-instagram"></i>
              </a>
              <a href="#" aria-label="YouTube" style={iconStyle}>
                <i className="icon-youtube"></i>
              </a>
            </div>
          </div>
          <div style={sectionStyle}>
            <h3 style={headingStyle}>Help</h3>
            <ul style={listStyle}>
              <li style={listItemStyle}><a href="#" style={linkStyle}>Support</a></li>
              <li style={listItemStyle}><a href="#" style={linkStyle}>Privacy</a></li>
            </ul>
          </div>
          <div style={sectionStyle}>
            <h3 style={headingStyle}>Download</h3>
            <div style={appButtonsStyle}>
              <img src="appstore.png" alt="App Store" style={appButtonImageStyle} />
              <img src="googleplay.png" alt="Google Play" style={appButtonImageStyle} />
            </div>
          </div>
        </div>
        <div style={footerBottomStyle}>
          <p style={copyrightStyle}>&copy; {new Date().getFullYear()} Strava. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
