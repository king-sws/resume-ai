export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Sellora!</title>
  <style>
    body {
      font-family: 'Inter', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #222;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #ccebff, #a8daff);
      color: #222;
      text-align: center;
      padding: 35px 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 600;
    }
    .body {
      padding: 35px 30px;
    }
    .body p {
      font-size: 16px;
      margin: 16px 0;
      line-height: 1.8;
      color: #444;
    }
    .cta-button {
      display: inline-block;
      background: #222;
      color: #ffffff !important;
      padding: 14px 32px;
      border-radius: 25px;
      text-decoration: none;
      font-weight: 600;
      margin: 25px 0;
      transition: all 0.3s ease;
    }
    .cta-button:hover {
      background: #000;
    }
    .features {
      margin: 25px 0;
      padding: 25px;
      background: #f9f9f9;
      border-radius: 10px;
      border-left: 4px solid #222;
    }
    .feature-item {
      display: flex;
      align-items: center;
      margin: 12px 0;
    }
    .feature-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .footer {
      text-align: center;
      padding: 25px;
      background-color: #f5f5f5;
      color: #666;
      font-size: 14px;
    }
    .highlight {
      color: #222;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to Sellora ✨</h1>
    </div>
    <div class="body">
      <p>Hello {userName},</p>
      <p>We're thrilled to have you join <span class="highlight">Sellora</span> — your modern e-commerce platform for seamless selling and shopping.</p>

      <div class="features">
        <div class="feature-item">
          <span class="feature-icon">🛍️</span>
          <span>Browse unique products from sellers worldwide</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">💳</span>
          <span>Secure checkout with multiple payment options</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📦</span>
          <span>Track your orders in real-time</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">⭐</span>
          <span>Get personalized recommendations</span>
        </div>
      </div>
      
      <p>Start exploring now:</p>
      <center>
        <a href="{dashboardLink}" class="cta-button">Start Shopping</a>
      </center>
      
      <p>Need assistance? Our <a href="{helpCenterLink}" style="color: #222;">Help Center</a> is here for you.</p>
     
      <p>Happy shopping! 🛒<br>
      <span class="highlight">– The Sellora Team</span></p>
    </div>
    <div class="footer">
      <p>© 2025 Sellora. All rights reserved.</p>
      <p>This email was sent to {userEmail}. <a href="{unsubscribeLink}" style="color: #666;">Manage preferences</a></p>
    </div>
  </div>
</body>
</html>
`;

