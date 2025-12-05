# Email Configuration Setup for Contact Form

## Gmail App Password Setup

To enable email sending from the contact form, you need to generate a Gmail App Password:

### Steps to Generate Gmail App Password:

1. **Enable 2-Step Verification**:
   - Go to your Google Account: https://myaccount.google.com/
   - Click on "Security" in the left menu
   - Under "Signing in to Google", enable "2-Step Verification"

2. **Generate App Password**:
   - After enabling 2-Step Verification, go back to Security
   - Under "Signing in to Google", click on "App passwords"
   - Select "Mail" for the app and "Other" for the device
   - Give it a name like "HANWO Contact Form"
   - Click "Generate"
   - Copy the 16-character password that appears

3. **Update .env File**:
   - Open the `.env` file in the root directory
   - Replace `your_app_password_here` with the generated app password
   - Example: `SMTP_PASS=abcd efgh ijkl mnop` (without spaces)

### .env Configuration

Your `.env` file should look like this:

```env
# SMTP Configuration for sending emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=agrorus.brend@gmail.com
SMTP_PASS=your_16_character_app_password

# Email settings
EMAIL_FROM=agrorus.brend@gmail.com
EMAIL_TO=agrorus.brend@gmail.com
```

## Installation

After setting up the .env file, install the required dependencies:

```bash
npm install
```

## Running the Server

Start the backend server:

```bash
npm run server
```

The server will run on http://localhost:4000

## Testing

1. Make sure the server is running (`npm run server`)
2. Start the frontend (`npm run dev`)
3. Go to the Contact page
4. Submit a test message
5. Check the email at agrorus.brend@gmail.com

## Troubleshooting

- **Email not sending**: Make sure the App Password is correct in the .env file
- **Authentication error**: Verify that 2-Step Verification is enabled
- **Connection timeout**: Check your internet connection and firewall settings
- **Messages saved but not emailed**: The server will still save messages to `server/data/messages.json` even if email fails

## Security Notes

- **Never commit the .env file to Git** - it contains sensitive credentials
- The .env file is already added to .gitignore
- Keep your App Password secure and don't share it
