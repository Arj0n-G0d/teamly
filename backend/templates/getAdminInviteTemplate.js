const getAdminInviteTemplate = (code) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Invite Code</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f8f9fa;
      padding: 20px;
      color: #212529;
    }
    .container {
      background: #ffffff;
      border-radius: 8px;
      padding: 20px;
      max-width: 500px;
      margin: auto;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }
    .code {
      font-size: 24px;
      font-weight: bold;
      color: #0d6efd;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      font-size: 12px;
      color: #6c757d;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>You're Almost There!</h2>
    <p>Hello,</p>
    <p>You've requested access as a <strong>Team Admin</strong>. Use the code below to complete your verification:</p>
    
    <div class="code">${code}</div>

    <p>This code is valid for <strong>10 minutes</strong>. If you did not request this, you can ignore this email.</p>

    <div class="footer">
      &copy; 2025 Teamly • This is an automated message
    </div>
  </div>
</body>
</html>
`;

export default getAdminInviteTemplate;
