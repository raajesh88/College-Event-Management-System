import React from 'react';

/**
 * Capybara Animated Loader (from Uiverse.io by Novaxlo)
 * Provides an adorable walking Capybara loader with running dash line
 */
const CapybaraLoader = ({ message = 'Loading campus events...' }) => {
  return (
    <div className="capybara-loader-container">
      <div className="capybaraloader">
        <div className="capybara">
          <div className="capyhead">
            <div className="capyear">
              <div className="capyear2"></div>
            </div>
            <div className="capyear"></div>
            <div className="capymouth">
              <div className="capylips"></div>
              <div className="capylips"></div>
            </div>
            <div className="capyeye"></div>
            <div className="capyeye"></div>
          </div>
          <div className="capyleg"></div>
          <div className="capyleg2"></div>
          <div className="capyleg2"></div>
          <div className="capy"></div>
        </div>
        <div className="loader">
          <div className="loaderline"></div>
        </div>
      </div>
      {message && <p className="capybara-loader-message">{message}</p>}
    </div>
  );
};

export default CapybaraLoader;
