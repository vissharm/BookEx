import {showNotification} from './helper.js'

const sendEmail = async (email, username) => {
    try {
      const response = await fetch('api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username}),
      });
  
      const result = await response.json();
      if (response.ok) {
        showNotification('Email sent successfully. Please check.', false);
        return result;
      } else {
        showNotification(result?.error || 'Username or Email is invalid.');
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  export default sendEmail;
  